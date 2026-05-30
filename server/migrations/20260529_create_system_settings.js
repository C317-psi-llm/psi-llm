exports.up = async function (knex) {
  await knex.schema.createTable("system_settings", (table) => {
    table.string("id", 50).primary();
    table.string("app_name", 100).notNullable();
    table.string("version", 30).notNullable();
    table.json("features").notNullable();
    table.json("security").notNullable();
    table.json("notifications").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex("system_settings").insert({
    id: "default",
    app_name: "Mentis",
    version: "1.0.0",
    features: JSON.stringify({
      chat: true,
      insights: true,
      gamification: true,
      alerts: true,
    }),
    security: JSON.stringify({
      passwordMinLength: 8,
      sessionTimeout: 15,
      mfaEnabled: false,
    }),
    notifications: JSON.stringify({
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
    }),
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("system_settings");
};