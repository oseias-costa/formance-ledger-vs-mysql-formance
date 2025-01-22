import axios from "axios";
import { Transaction } from "./types";
import { formanceParser } from "./numscriptParser";
import fs from "fs/promises";
import path from "path";
import Decimal from "decimal.js";

const filePath = path.join("./", "formanceResults.csv");

const api = axios.create({
  baseURL: "http://localhost:8080/v2/test",
});

async function startLedger() {
  return axios.get("http://127.0.0.1:8080/test/transactions");
}

async function createTransaction(transaction) {
  try {
    await api.post(`/transactions`, transaction);
  } catch (e) {
    console.error(e.message);
  }
}

async function createTransactions(
  transactions: Transaction[],
  chunkNumber = 0,
) {
  const parsedTransactions = transactions.map((transaction) =>
    formanceParser(transaction),
  );

  const startTime = performance.now();
  for (const transaction of parsedTransactions) {
    try {
      await api.post("/transactions", transaction);
    } catch (e) {
      console.error(e.message);
    }
  }
  const endTime = performance.now();
  await fs.appendFile(
    filePath,
    `${new Decimal(endTime).minus(startTime).dividedBy(10000)}\n`,
  );
}

async function getBalance(account: string) {
  const data = await api.post(`/`, {
    source: "account",
  });
}

export { createTransaction, startLedger, createTransactions };
