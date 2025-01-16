import mysql from "mysql2/promise";
import { Transaction, typeId } from "./types";
import { createTransactions } from "./formance.api";
import fs from "fs/promises";
import path from "path";

const filePath = path.join("./", "mysqlResults.csv");
export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mysqlroot",
  port: 3326,
  database: "ledger",
  waitForConnections: true,
  connectionLimit: 151,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 151,
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

export const createMysqlTransactions = async (transactions: Transaction[], chunkNumber = 0) => {
  const conn = await pool.getConnection();

  const startTime = performance.now();

  try {
    await conn.beginTransaction();

    for (const transaction of transactions) {
      const {
        transactionType,
        reference,
        description,
        amount,
        source,
        destination,
      } = transaction;

      const createTransaction = await conn.query(
        `
        INSERT INTO ledger.Transaction 
        (transactionTypeId, reference, description) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE description = VALUES(description);`,
        [typeId[transactionType], reference, description],
      );

      const transactionId =
        createTransaction[0]["insertId"] === 0
          ? 1
          : createTransaction[0]["insertId"];

      await conn.query(
        `
        INSERT INTO ledger.Movement 
        (amount, source, destination, transactionId)
        VALUES (?, ?, ?, ?);
`,
        [amount, source, destination, transactionId],
      );
    }
  } catch (err) {
    await conn.rollback();
    console.log("error: ", err);
  } finally {
    conn.release();
  }

  await conn.commit();
  const endTime = performance.now();
  await fs.appendFile(filePath, `${chunkNumber},${endTime - startTime}\n`)
};

export const getLastTransaction = async (): Promise<number> => {
  const lastTransaction = await pool.query(
    "SELECT `id`from ledger.`Transaction` ORDER BY `id` DESC LIMIT 1;",
  );

  return lastTransaction ? lastTransaction[0][0]?.id : 0;
};
