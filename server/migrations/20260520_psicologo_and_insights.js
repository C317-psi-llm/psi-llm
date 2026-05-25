exports.up = async function (knex) {
  await knex.schema.alterTable("usuario", (table) => {
    table
      .integer("id_psicologo")
      .unsigned()
      .nullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("SET NULL");
  });

  await knex.schema.dropTableIfExists("insight");

  await knex.schema.createTable("insights", (table) => {
    table.increments("id_insight").primary();
    table
      .integer("id_usuario")
      .unsigned()
      .notNullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("CASCADE");
    table
      .integer("id_psicologo")
      .unsigned()
      .nullable()
      .references("id_usuario")
      .inTable("usuario")
      .onDelete("SET NULL");
    table.text("conteudo").notNullable();
    table.string("seriedade", 20).notNullable();
    table.string("origem", 20).notNullable().defaultTo("manual");
    table.timestamp("criado_em").notNullable().defaultTo(knex.fn.now());
    table.timestamp("modificado_em").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("insights");
  await knex.schema.createTable("insight", (table) => {
    table.increments("id_insight").primary();
  });
  await knex.schema.alterTable("usuario", (table) => {
    table.dropColumn("id_psicologo");
  });
};
