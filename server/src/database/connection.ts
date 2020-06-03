import knex from "knex";
import path from "path";

/**
 * Utilizar o comando npm run knex:migrate
 * para realizar as alterações em banco
 */

const connection = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
});

export default connection;
