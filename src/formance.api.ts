import fs from "fs/promises";
import { fileURLToPath } from "node:url";
import path from "path";
import axios from "axios";
import { Transaction } from "./types";
import { formanceParser } from "./numscriptParser";

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

async function createTransactions(transactions: Transaction[]) {
  const startTime = performance.now();

  for (const transaction of transactions) {
    try {
      await api.post("/transactions", formanceParser(transaction));
    } catch (e) {
      console.error(e.message);
    }
  }

  const endtime = performance.now();
}

async function getBalance(account: string) {
  const data = await api.post(`/`, {
    source: "account",
  });
}

export { createTransaction, startLedger, createTransactions };
