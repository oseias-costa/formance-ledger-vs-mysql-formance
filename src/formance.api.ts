import fs from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'path';
import axios from 'axios';

const api = axios.create(
  {
    baseURL: 'http://localhost:8080/v2/test'
  }
)

async function startLedger(){
  return api.post('/')
}
async function createTransaction(transaction){
  try {
    await api.post(`/transactions`, transaction)
  }catch(e){
    console.error(e.message);
  }
}

async function getBalance(account: string){
  const data = await api.post(`/`, {
    source: 'account',
  })
}

export { createTransaction, startLedger }