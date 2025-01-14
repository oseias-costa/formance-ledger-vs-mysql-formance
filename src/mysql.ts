import mysql from "mysql2/promise";
import { Transaction, typeId } from "./types";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mysqlroot",
  port: 3326,
  database: "ledger",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
});

export const createQueryMysql = ({
  transactionType,
  reference,
  description,
  amount,
  source,
  destination,
  id,
}: Transaction) => {
  return `
        INSERT INTO ledger.Transaction 
        (id, transactionTypeId, reference, description) 
        VALUES (${id}, ${typeId[transactionType]}, "${reference}", "${description}");

        INSERT INTO ledger.Movement 
        (amount, source, destination, transactionId)
        VALUES (${amount}, "${source}", "${destination}", ${id});
  `;
};

export const createMysqlTransaction = async (query: string) => {
  try {
    await pool.query(query);
  } catch (err) {
    console.log("error: ", err);
  }
};
