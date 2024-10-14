import knex from "knex";

import env from "./env";

const db = knex({
  client: "postgres",
  connection: {
    connectionString: env.DB_URL, 
    ssl: {
      rejectUnauthorized: false
    }
  },
  pool: {
    min: env.DB_POOL_MIN || 2, 
    max: env.DB_POOL_MAX || 10
  }
});
export default db;
