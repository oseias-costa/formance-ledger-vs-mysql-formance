import mysql from "mysql2";
import { Transaction, typeId } from "./types";

export const connection = mysql.createPool(
  "jdbc:mysql://localhost:3326/ledger?user=root&password=mysqlroot",
);

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
        VALUES (${id}, ${typeId[transactionType]}, ${reference}, ${description});

        INSERT INTO ledger.Moviment 
        (description, amount, source, destination, transactionId)
        VALUES (${amount}, ${source}, ${destination}, ${transactionType}, ${id});
  `;
};

export const createTransaction = async (query: string) => {
  try {
    await connection.promise().query(query);
  } catch (err) {
    console.log("error: ", err);
  }
};
