require("dotenv").config();

module.exports = {
  client: "pg",
  connection: {
    host: process.env.PGHOST || "127.0.0.1",
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5433,
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "mentis",
  },
  migrations: {
    directory: __dirname + "/migrations",
  },
  seeds: {
    directory: __dirname + "/seeds",
  },
};
