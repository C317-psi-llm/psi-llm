import db from "../db/knex";
import UserRepository from "../repositories/user.repository";

class GamificationService {
  static async getUserGamification(id_usuario: number) {
    const user = await UserRepository.findById(id_usuario);
    if (!user) throw { status: 404, message: "User not found" };

    const history = await db("resposta_questionario")
      .where({ id_usuario })
      .orderBy("data_resposta", "desc");

    const latestResponse = history[0];
    const averageScore = latestResponse
      ? Number(latestResponse.pontuacao_total ?? user.pontuacao_total ?? 0)
      : user.pontuacao_total != null
        ? Number(user.pontuacao_total)
        : null;

    const progressPercent =
      averageScore !== null
        ? Math.max(0, Math.min(100, 100 - averageScore))
        : 0;
    const xp = Math.round(progressPercent * 10);
    const xpToNextLevel = Math.max(0, 1000 - xp);

    return {
      level:
        averageScore !== null ? this.levelFromScore(averageScore) : "Sem dados",
      healthScore: averageScore !== null ? Math.round(100 - averageScore) : 0,
      progressPercent,
      currentXp: xp,
      xpToNextLevel,
      streakDays: this.computeStreakDays(history),
      totalCheckIns: history.length,
      latestClassification: latestResponse?.classificacao_geral ?? "Sem dados",
      achievements: this.buildAchievements(history, averageScore),
      recentActivities: this.buildRecentActivities(history),
    };
  }

  static buildAchievements(history: any[], averageScore: number | null) {
    return [
      {
        id: "first-questionnaire",
        title: "Primeiro check-in",
        description: "Registrou seu primeiro check-in de bem-estar.",
        unlocked: history.length >= 1,
      },
      {
        id: "seven-day-streak",
        title: "7 dias seguidos",
        description: "Manteve a rotina de check-ins consecutivos.",
        unlocked: this.computeStreakDays(history) >= 7,
      },
      {
        id: "balanced-health",
        title: "Equilíbrio em foco",
        description: "Alcançou um índice de bem-estar equilibrado.",
        unlocked: averageScore !== null && averageScore <= 33,
      },
    ];
  }

  static buildRecentActivities(history: any[]) {
    return history.slice(0, 3).map((entry) => ({
      id: `response-${entry.id_resposta_questionario}`,
      label: `Check-in em ${this.formatDate(entry.data_resposta)} — ${entry.classificacao_geral || "Sem classificação"}`,
      xp: 20,
    }));
  }

  static computeStreakDays(history: any[]) {
    if (!history || history.length === 0) return 0;

    let streak = 0;
    let previousDate: Date | null = null;

    for (const entry of history) {
      const currentDate = new Date(entry.data_resposta);
      currentDate.setHours(0, 0, 0, 0);
      if (!previousDate) {
        streak = 1;
      } else {
        const diff = Math.round(
          (previousDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (diff === 0) {
          continue;
        }
        if (diff === 1) {
          streak += 1;
        } else {
          break;
        }
      }
      previousDate = currentDate;
    }

    return streak;
  }

  static levelFromScore(averageScore: number) {
    if (averageScore <= 33) return "Equilibrado";
    if (averageScore <= 66) return "Atenção";
    return "Precisa de apoio";
  }

  static formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  }
}

export default GamificationService;
