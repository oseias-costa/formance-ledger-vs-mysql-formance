import fs from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'path';
import axios from 'axios';

const api = axios.create(
  {
    baseURL: 'http://localhost:8080/v2/test'
  }
)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'results.csv')

async function createTransactions(transactions: string[]) {
  await api.post(`/`)
  const times = []

  for(const transaction of transactions) {
    const startTime = performance.now();
    await createTransaction(transaction)
    const endTime = performance.now();
    times.push(endTime - startTime);
  }
  await fs.appendFile(filePath, times.toString())
}


async function createTransaction(transaction) {
  await api.post(`/transactions`, transaction)
}

async function getBalance(account: string){
  const data = await api.post(`/`, {
    source: 'account',
  })
}


export { createTransactions }