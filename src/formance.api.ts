import fs from "fs/promises";
import { fileURLToPath } from "node:url";
import path from "path";
import axios from "axios";

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
async function createTransactions(transactions) {
  const promises = []
  const startTime = performance.now();
  transactions.map(async transaction => {
    try {
      promises.push(api.post(`/transactions`, transaction))
    } catch (e) {
      console.error(e.message);
    }
  })
  await Promise.all(promises);
  const endtime = performance.now();
  return endtime - startTime;
}
async function getBalance(account: string) {
  const data = await api.post(`/`, {
    source: "account",
  });
}

export { createTransaction, startLedger, createTransactions };

