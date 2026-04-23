/**
 * Create schema following the ERD provided.
 * Includes an auxiliary table `refresh_token` to support refresh token rotation.
 */

exports.up = async function (knex) {
  await knex.schema.createTable("empresa", (table) => {
    table.increments("id_empresa").primary();
    table.string("nome", 100).notNullable();
    table.string("cnpj", 18).notNullable();
    table.string("email_contato", 100).notNullable();
    table.string("telefone", 20);
    table.string("status", 20).notNullable();
    table.timestamp("data_cadastro").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("usuario", (table) => {
    table.increments("id_usuario").primary();
    table
      .integer("id_empresa")
      .unsigned()
      .notNullable()
      .references("id_empresa")
      .inTable("empresa")
      .onDelete("CASCADE");
    table.string("nome", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("senha_hash", 255).notNullable();
    table.string("papel", 20).notNullable();
    table.string("status", 20).notNullable();
    table.boolean("aceitou_lgpd").notNullable().defaultTo(false);
    table.timestamp("data_aceite");
    table.integer("pontuacao_total");
    table.timestamp("data_cadastro").notNullable().defaultTo(knex.fn.now());
    table.timestamp("ultimo_acesso");
    table.integer("dias_acesso");
  });

  await knex.schema.createTable("conversa_ia", (table) => {
    table.increments("id_conversa").primary();
    table
      .integer("id_usuario")
      .unsigned()
      .notNullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("CASCADE");
    table.timestamp("data_inicio").notNullable().defaultTo(knex.fn.now());
    table.timestamp("data_fim");
    table.string("status", 20).notNullable();
    table.boolean("disclaimer_aceito").notNullable().defaultTo(false);
  });

  await knex.schema.createTable("mensagem", (table) => {
    table.increments("id_mensagem").primary();
    table
      .integer("id_conversa")
      .unsigned()
      .notNullable()
      .references("id_conversa")
      .inTable("conversa_ia")
      .onDelete("CASCADE");
    table.text("conteudo").notNullable();
    table.string("remetente", 20).notNullable();
    table.timestamp("data_envio").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("questionario", (table) => {
    table.increments("id_questionario").primary();
    table.string("titulo", 100).notNullable();
    table.text("descricao");
    table.json("estrutura_json").notNullable();
    table.string("status", 20).notNullable();
    table.timestamp("data_criacao").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("resposta_questionario", (table) => {
    table.increments("id_resposta_questionario").primary();
    table
      .integer("id_usuario")
      .unsigned()
      .notNullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("CASCADE");
    table
      .integer("id_questionario")
      .unsigned()
      .notNullable()
      .references("id_questionario")
      .inTable("questionario")
      .onDelete("CASCADE");
    table.json("respostas_json").notNullable();
    table.decimal("pontuacao_total", 5, 2);
    table.integer("nivel_estresse").notNullable().defaultTo(0);
    table.integer("nivel_ansiedade").notNullable().defaultTo(0);
    table.integer("nivel_burnout").notNullable().defaultTo(0);
    table.integer("nivel_depressao").notNullable().defaultTo(0);
    table.string("classificacao_geral", 20);
    table.text("observacao_geral");
    table.timestamp("data_resposta").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("alerta", (table) => {
    table.increments("id_alerta").primary();
    table
      .integer("id_usuario")
      .unsigned()
      .notNullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("CASCADE");
    table
      .integer("id_resposta_questionario")
      .unsigned()
      .references("id_resposta_questionario")
      .inTable("resposta_questionario")
      .onDelete("SET NULL");
    table.string("tipo_alerta", 50).notNullable();
    table.text("descricao");
    table.string("nivel_gravidade", 20).notNullable();
    table.timestamp("data_geracao").notNullable().defaultTo(knex.fn.now());
    table.string("status", 20).notNullable();
  });

  await knex.schema.createTable("insight", (table) => {
    table.increments("id_insight").primary();
    table
      .integer("id_usuario_destino")
      .unsigned()
      .notNullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("CASCADE");
    table
      .integer("id_resposta_questionario")
      .unsigned()
      .notNullable()
      .references("id_resposta_questionario")
      .inTable("resposta_questionario")
      .onDelete("CASCADE");
    table
      .integer("id_psicologo_responsavel")
      .unsigned()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("SET NULL");
    table.string("titulo", 100).notNullable();
    table.text("descricao").notNullable();
    table.string("tipo", 20).notNullable();
    table.string("status", 20).notNullable();
    table.timestamp("data_criacao").notNullable().defaultTo(knex.fn.now());
    table.timestamp("data_validacao");
  });

  // Auxiliary table to manage refresh tokens (revocation/rotation)
  await knex.schema.createTable("refresh_token", (table) => {
    table.increments("id").primary();
    table
      .integer("id_usuario")
      .unsigned()
      .notNullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("CASCADE");
    table.string("token_hash", 255).notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.boolean("revoked").notNullable().defaultTo(false);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("refresh_token");
  await knex.schema.dropTableIfExists("insight");
  await knex.schema.dropTableIfExists("alerta");
  await knex.schema.dropTableIfExists("resposta_questionario");
  await knex.schema.dropTableIfExists("questionario");
  await knex.schema.dropTableIfExists("mensagem");
  await knex.schema.dropTableIfExists("conversa_ia");
  await knex.schema.dropTableIfExists("usuario");
  await knex.schema.dropTableIfExists("empresa");
};
