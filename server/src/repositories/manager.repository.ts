import db from "../db/knex";

class ManagerRepository {
  private static systemSettings = {
    appName: "Mentis",
    version: "1.0.0",
    features: {
      chat: true,
      insights: true,
      gamification: true,
      alerts: true,
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 15,
      mfaEnabled: false,
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
    },
  };

  /**
   * Obter estatísticas resumidas do painel administrativo
   */
  static async getDashboardStats() {
    const [registeredPatients] = await db("usuario")
      .where({ papel: "funcionario", status: "active" })
      .count<{ count: string }[]>("* as count");

    const [activePsychologists] = await db("usuario")
      .where({ papel: "psicologo", status: "active" })
      .count<{ count: string }[]>("* as count");

    const [totalUsers] = await db("usuario")
      .where({ status: "active" })
      .count<{ count: string }[]>("* as count");

    const [completedCheckins] = await db("conversa_ia")
      .whereIn("status", ["active", "completed", "finalizada"])
      .count<{ count: string }[]>("* as count");

    const [highRiskPatients] = await db("insights")
      .where({ seriedade: "alerta" })
      .countDistinct<{ count: string }[]>("id_usuario as count");

    return {
      registeredPatients: Number(registeredPatients?.count || 0),
      activePsychologists: Number(activePsychologists?.count || 0),
      totalUsers: Number(totalUsers?.count || 0),
      completedCheckins: Number(completedCheckins?.count || 0),
      highRiskPatients: Number(highRiskPatients?.count || 0),
    };
  }

  /**
   * Obter distribuicao de risco por paciente ativo.
   * Usa o insight mais recente do paciente para evitar contagens duplicadas.
   */
  static async getRiskDistribution() {
    const patients = await db("usuario")
      .where({ papel: "funcionario", status: "active" })
      .select("id_usuario");

    const total = patients.length;
    const patientIds = patients.map((patient) => patient.id_usuario);

    const latestRiskByPatient = new Map<number, string>();

    if (patientIds.length > 0) {
      const insights = await db("insights")
        .whereIn("id_usuario", patientIds)
        .select("id_usuario", "seriedade", "criado_em")
        .orderBy("criado_em", "desc");

      for (const insight of insights) {
        if (!latestRiskByPatient.has(insight.id_usuario)) {
          latestRiskByPatient.set(insight.id_usuario, insight.seriedade);
        }
      }
    }

    let low = 0;
    let medium = 0;
    let high = 0;

    for (const patient of patients) {
      const risk = latestRiskByPatient.get(patient.id_usuario);

      if (risk === "alerta") {
        high += 1;
      } else if (risk === "padrao") {
        medium += 1;
      } else {
        low += 1;
      }
    }

    const toPercent = (count: number) =>
      total > 0 ? Math.round((count / total) * 100) : 0;

    return [
      { id: "low", label: "Baixo", patients: low, value: toPercent(low) },
      { id: "medium", label: "Medio", patients: medium, value: toPercent(medium) },
      { id: "high", label: "Alto", patients: high, value: toPercent(high) },
    ];
  }

  /**
   * Listar todos os psicólogos com estatísticas
   */
  static async listPsychologists(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const psychologists = await db("usuario")
      .where({ papel: "psicologo", status: "active" })
      .select("id_usuario", "nome", "email", "status", "data_cadastro")
      .limit(limit)
      .offset(offset)
      .orderBy("data_cadastro", "desc");

    const [{ count }] = await db("usuario")
      .where({ papel: "psicologo", status: "active" })
      .count<{ count: string }[]>("* as count");

    // Adicionar contagem de pacientes para cada psicólogo
    const psychologistsWithStats = await Promise.all(
      psychologists.map(async (psych) => {
        const [{ count: patientCount }] = await db("usuario")
          .where({
            papel: "funcionario",
            id_psicologo: psych.id_usuario,
            status: "active",
          })
          .count<{ count: string }[]>("* as count");

        return {
          ...psych,
          patientCount: Number(patientCount || 0),
        };
      })
    );

    return {
      items: psychologistsWithStats,
      page,
      limit,
      total: Number(count || 0),
    };
  }

  /**
   * Listar todos os pacientes com informações do psicólogo
   */
  static async listPatients(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const patients = await db("usuario as u")
      .leftJoin("usuario as psych", "u.id_psicologo", "psych.id_usuario")
      .where({ "u.papel": "funcionario", "u.status": "active" })
      .select(
        "u.id_usuario",
        "u.nome",
        "u.email",
        "u.status",
        "u.data_cadastro",
        "u.aceitou_lgpd",
        db.raw("psych.nome as psicologo_nome"),
        db.raw("psych.id_usuario as psicologo_id")
      )
      .limit(limit)
      .offset(offset)
      .orderBy("u.data_cadastro", "desc");

    const [{ count }] = await db("usuario")
      .where({ papel: "funcionario", status: "active" })
      .count<{ count: string }[]>("* as count");

    return {
      items: patients,
      page,
      limit,
      total: Number(count || 0),
    };
  }

  /**
   * Obter detalhes de um paciente específico
   */
  static async getPatientDetail(id: number) {
    return db("usuario as u")
      .leftJoin("usuario as psych", "u.id_psicologo", "psych.id_usuario")
      .where({ "u.id_usuario": id, "u.papel": "funcionario" })
      .select(
        "u.id_usuario",
        "u.nome",
        "u.email",
        "u.status",
        "u.data_cadastro",
        "u.aceitou_lgpd",
        db.raw("psych.nome as psicologo_nome"),
        db.raw("psych.id_usuario as psicologo_id")
      )
      .first();
  }

  /**
   * Obter estatísticas de check-ins por semana (últimas 4 semanas)
   */
  static async getCheckinsStats() {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const emptyWeeks = [
      { week: "Sem 1", checkins: 0 },
      { week: "Sem 2", checkins: 0 },
      { week: "Sem 3", checkins: 0 },
      { week: "Sem 4", checkins: 0 },
    ];

    const checkins = await db("conversa_ia")
      .where("data_inicio", ">=", fourWeeksAgo)
      .select("data_inicio")
      .orderBy("data_inicio", "asc")
      .catch(() => []);

    // Fallback se o banco não tiver data_inicio
    if (!checkins || checkins.length === 0) {
      return emptyWeeks;
    }

    return emptyWeeks.map((week, index) => {
      const weekStart = new Date(fourWeeksAgo);
      weekStart.setDate(fourWeeksAgo.getDate() + index * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const checkinsInWeek = checkins.reduce((total: number, row: any) => {
        const rowDate = new Date(row.data_inicio);
        const isSameWindow = rowDate >= weekStart && rowDate < weekEnd;
        return isSameWindow ? total + 1 : total;
      }, 0);

      return {
        ...week,
        checkins: checkinsInWeek,
      };
    });
  }

  /**
   * Listar usuários com filtro por papel
   */
  static async listUsersByRole(papel: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const users = await db("usuario")
      .where({ papel, status: "active" })
      .select("id_usuario", "nome", "email", "status", "data_cadastro")
      .limit(limit)
      .offset(offset)
      .orderBy("data_cadastro", "desc");

    const [{ count }] = await db("usuario")
      .where({ papel, status: "active" })
      .count<{ count: string }[]>("* as count");

    return {
      items: users,
      page,
      limit,
      total: Number(count || 0),
    };
  }

  /**
   * Contar usuários por papel (para distribuição)
   */
  static async countUsersByRole() {
    const roles = await db("usuario")
      .where({ status: "active" })
      .select("papel")
      .count<{ count: string }[]>("* as count")
      .groupBy("papel");

    return roles.map((row: any) => ({
      papel: row.papel,
      count: Number(row.count || 0),
    }));
  }

  /**
   * Atualizar status de um usuário
   */
  static async updateUserStatus(id: number, status: "active" | "inactive") {
    return db("usuario").where({ id_usuario: id }).update({ status });
  }

  /**
   * Deletar usuário (soft delete - apenas marca como inativo)
   */
  static async deleteUser(id: number) {
    return this.updateUserStatus(id, "inactive");
  }

  /**
   * Listar alertas (insights com seriedade 'alerta')
   */
  static async listAlerts(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const alerts = await db("insights")
      .leftJoin("usuario as u", "insights.id_usuario", "u.id_usuario")
      .leftJoin("usuario as p", "insights.id_psicologo", "p.id_usuario")
      .where({ "insights.seriedade": "alerta" })
      .select(
        "insights.id_insight",
        "insights.conteudo",
        "insights.seriedade",
        "insights.origem",
        "insights.criado_em",
        db.raw("u.nome as usuario_nome"),
        db.raw("p.nome as psicologo_nome")
      )
      .limit(limit)
      .offset(offset)
      .orderBy("insights.criado_em", "desc");

    const [{ count }] = await db("insights")
      .where({ seriedade: "alerta" })
      .count<{ count: string }[]>("* as count");

    return {
      items: alerts,
      page,
      limit,
      total: Number(count || 0),
    };
  }

  /**
   * Contar alertas por tipo de origem
   */
  static async countAlertsByOrigin() {
    const alerts = await db("insights")
      .where({ seriedade: "alerta" })
      .select("origem")
      .count<{ count: string }[]>("* as count")
      .groupBy("origem");

    return alerts.map((row: any) => ({
      origem: row.origem,
      count: Number(row.count || 0),
    }));
  }

  /**
   * Gerar relatório de saúde mental (agregado)
   */
  static async generateMentalHealthReport() {
    const [totalPatients] = await db("usuario")
      .where({ papel: "funcionario", status: "active" })
      .count<{ count: string }[]>("* as count");

    const [insightsGenerated] = await db("insights")
      .count<{ count: string }[]>("* as count");

    const [alertsActive] = await db("insights")
      .where({ seriedade: "alerta" })
      .count<{ count: string }[]>("* as count");

    const alertsByOrigin = await this.countAlertsByOrigin();

    return {
      totalPatients: Number(totalPatients?.count || 0),
      insightsGenerated: Number(insightsGenerated?.count || 0),
      alertsActive: Number(alertsActive?.count || 0),
      alertsByOrigin,
    };
  }

  /**
   * Obter status de aceite LGPD por usuário
   */
  static async getLGPDStatus(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const users = await db("usuario")
      .where({ status: "active" })
      .select(
        "id_usuario",
        "nome",
        "email",
        "papel",
        "aceitou_lgpd",
        "data_cadastro"
      )
      .limit(limit)
      .offset(offset)
      .orderBy("data_cadastro", "desc");

    const [{ count }] = await db("usuario")
      .where({ status: "active" })
      .count<{ count: string }[]>("* as count");

    const [{ count: acceptedCount }] = await db("usuario")
      .where({ status: "active", aceitou_lgpd: true })
      .count<{ count: string }[]>("* as count");

    const total = Number(count || 0);
    const acceptanceRate =
      total > 0 ? Math.round((Number(acceptedCount || 0) / total) * 100) : 0;

    return {
      items: users,
      page,
      limit,
      total: Number(count || 0),
      acceptanceRate,
    };
  }

  /**
   * Obter configurações do sistema (mockado)
   */
  static async getSystemSettings() {
    return this.systemSettings;
  }

  /**
   * Atualizar configurações do sistema (mockado)
   */
  static async updateSystemSettings(settings: Record<string, any>) {
    this.systemSettings = {
      ...this.systemSettings,
      ...settings,
      features: {
        ...this.systemSettings.features,
        ...(settings.features || {}),
      },
      security: {
        ...this.systemSettings.security,
        ...(settings.security || {}),
      },
      notifications: {
        ...this.systemSettings.notifications,
        ...(settings.notifications || {}),
      },
    };
    return {
      success: true,
      message: "Configurações atualizadas com sucesso",
      settings: this.systemSettings,
    };
  }
}

export default ManagerRepository;
