import { fakerPT_BR as faker } from "@faker-js/faker";
import { Transaction } from "./types";
import { createTransactions, startLedger } from "./formance.api";
import { createMysqlTransactions } from "./mysql";

const TOTAL_TRANSACTIONS = 400;
const TOTAL_COMPANIES = 100;
const CHUNK_SIZE = 100;
const CHUNKS = Math.ceil(TOTAL_TRANSACTIONS / CHUNK_SIZE);

async function main() {
  const transactions = [];
  const companies: string[] = [];

  console.log({ CHUNK_SIZE, CHUNKS });

  for (let i = 1; i <= TOTAL_COMPANIES; i++) {
    const transaction: Transaction = {
      transactionType: "V2_ADD_POINTS",
      reference: `v2:transaction:${faker.string.uuid()}`,
      description: "Compra de pontos" + i,
      destination: faker.string.uuid(),
      amount: 10000000,
      source: "world",
    };

    transactions.push(transaction);
    companies.push(transaction.destination);
  }

  try {
    await Promise.all([
      createMysqlTransactions(transactions),
      createTransactions(transactions),
    ]);

    console.log("transactions companies finished");
  } catch (e) {
    console.error(e);
  }

  const users = [];

  for (let i = 0; i < CHUNKS; i++) {
    let chunkTransactions = [];

    const user = faker.string.uuid();
    users.push(user);

    for (let j = 0; j < CHUNK_SIZE; j++) {
      const transaction: Transaction = {
        transactionType: "V2_ACCOUNT_SEND",
        reference: `v2:transaction:${faker.string.uuid()}`,
        description: faker.finance.transactionType(),
        destination: faker.helpers.arrayElement(users),
        amount: faker.number.int({ min: 1, max: 250 }),
        source: faker.helpers.arrayElement(companies),
      };

      chunkTransactions.push(transaction);
    }

    await Promise.all([
      createMysqlTransactions(chunkTransactions),
      createTransactions(chunkTransactions),
    ]);
  }
}
main();
