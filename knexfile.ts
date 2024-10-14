import env from "./server/env";

module.exports = {
  production: {
    client: "postgresql",
    connection: env.DB_URL,
    migrations: {
      tableName: "knex_migrations",
      directory: "server/migrations"
    }
  }
};
