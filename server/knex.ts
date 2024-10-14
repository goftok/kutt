import knex from "knex";

import env from "./env";

const db = knex({
  client: "postgres",
  connection:  env.DB_URL, 
  pool: {
    min: env.DB_POOL_MIN, 
    max: env.DB_POOL_MAX
  }
});
export default db;
