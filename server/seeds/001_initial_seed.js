const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Clean tables (reverse order to avoid FK issues)
  await knex("refresh_token")
    .del()
    .catch(() => {});
  await knex("insight")
    .del()
    .catch(() => {});
  await knex("alerta")
    .del()
    .catch(() => {});
  await knex("resposta_questionario")
    .del()
    .catch(() => {});
  await knex("questionario")
    .del()
    .catch(() => {});
  await knex("mensagem")
    .del()
    .catch(() => {});
  await knex("conversa_ia")
    .del()
    .catch(() => {});
  await knex("usuario")
    .del()
    .catch(() => {});
  await knex("empresa")
    .del()
    .catch(() => {});

  // Create a sample company
  const insertedEmpresa = await knex("empresa")
    .insert({
      nome: "Mentis Tech",
      cnpj: "00.000.000/0001-00",
      email_contato: "contato@mentis.test",
      telefone: null,
      status: "active",
      data_cadastro: knex.fn.now(),
    })
    .returning("id_empresa");

  // knex returning may return [{ id_empresa: X }] or [X] depending on driver/version
  let empresaId;
  if (Array.isArray(insertedEmpresa) && insertedEmpresa.length > 0) {
    empresaId =
      typeof insertedEmpresa[0] === "object"
        ? insertedEmpresa[0].id_empresa
        : insertedEmpresa[0];
  } else {
    empresaId = insertedEmpresa;
  }

  // Helper to insert a user
  const insertUser = async ({ nome, email, password, papel }) => {
    const salt = bcrypt.genSaltSync(10);
    const senha_hash = bcrypt.hashSync(password, salt);
    const inserted = await knex("usuario")
      .insert({
        id_empresa: empresaId,
        nome,
        email,
        senha_hash,
        papel,
        status: "active",
        aceitou_lgpd: false,
        data_cadastro: knex.fn.now(),
      })
      .returning("id_usuario");
    if (Array.isArray(inserted) && inserted.length > 0) {
      return typeof inserted[0] === "object"
        ? inserted[0].id_usuario
        : inserted[0];
    }
    return inserted;
  };

  await insertUser({
    nome: "Admin Mentis",
    email: "admin@mentis.test",
    password: "Passw0rd!",
    papel: "admin",
  });
  await insertUser({
    nome: "Psicologo Teste",
    email: "psicologo@mentis.test",
    password: "Passw0rd!",
    papel: "psicologo",
  });
  await insertUser({
    nome: "Gestor Teste",
    email: "gestor@mentis.test",
    password: "Passw0rd!",
    papel: "gestor",
  });
  await insertUser({
    nome: "Funcionario Teste",
    email: "funcionario@mentis.test",
    password: "Passw0rd!",
    papel: "funcionario",
  });

  // Create a simple dynamic questionnaire
  const estrutura = {
    title: "Questionário inicial de triagem",
    sections: [
      {
        key: "estresse",
        title: "Estresse",
        questions: [
          {
            id: "e1",
            text: "Sinto-me tenso frequentemente",
            type: "scale",
            max: 4,
          },
          {
            id: "e2",
            text: "Tenho dificuldade para relaxar",
            type: "scale",
            max: 4,
          },
        ],
      },
      {
        key: "ansiedade",
        title: "Ansiedade",
        questions: [
          {
            id: "a1",
            text: "Preocupo-me excessivamente",
            type: "scale",
            max: 4,
          },
          {
            id: "a2",
            text: "Sinto medo sem razão aparente",
            type: "scale",
            max: 4,
          },
        ],
      },
      {
        key: "burnout",
        title: "Burnout",
        questions: [
          {
            id: "b1",
            text: "Sinto-me exausto no trabalho",
            type: "scale",
            max: 4,
          },
          {
            id: "b2",
            text: "Perdi interesse pelas minhas tarefas",
            type: "scale",
            max: 4,
          },
        ],
      },
      {
        key: "depressao",
        title: "Depressão",
        questions: [
          {
            id: "d1",
            text: "Perco interesse nas atividades que antes gostava",
            type: "scale",
            max: 4,
          },
          { id: "d2", text: "Sinto-me sem esperança", type: "scale", max: 4 },
        ],
      },
    ],
  };

  await knex("questionario").insert({
    titulo: "Triagem inicial - versão 1",
    descricao: "Questionário dinâmico para triagem inicial de saúde mental.",
    estrutura_json: JSON.stringify(estrutura),
    status: "active",
    data_criacao: knex.fn.now(),
  });
};
