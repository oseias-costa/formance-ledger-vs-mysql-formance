import { fakerPT_BR as faker } from '@faker-js/faker';
import { Transaction } from './types';
import { formanceParser } from './numscriptParser';
import { createTransaction, createTransactions, startLedger } from './formance.api';
import { createMysqlTransaction, createQueryMysql } from './mysql';

async function main() {

  const transactions = [];
  const companies: string[] = [];
  const CHUNK_SIZE = 10;
  const CHUNKS = 3

  for (let i = 1; i <= 100; i++) {
    const transaction: Transaction = {
      id: i,
      transactionType: 'V2_ACCOUNT_SEND',
      reference: `v2:transaction:${faker.string.uuid()}`,
      description: faker.finance.transactionType(),
      destination: faker.string.uuid(),
      amount: 10000000,
      source: 'world',
    };
    transactions.push(transaction);
    companies.push(transaction.destination);
  }

  try {
    const transactionsPromises = []
    await startLedger();
    transactions.map(async transaction => {
      const formanceTransaction = formanceParser(transaction);
      transactionsPromises.push(createTransaction(formanceTransaction));
      console.log('Transaction ', (transaction.id));
    });
    console.log('transactions promises created');
    await Promise.all(transactionsPromises);
    console.log('transactions finished');
  } catch (e) {
    console.error(e);
  }

  const users = [];


   let countTransactions = 0

  for (let i = 0; i < CHUNKS; i++) {
    const parsedTransactionsFormance= [];
    const parsedTransactionsMysql = [];

    const user = faker.string.uuid();
    users.push(user);

    for (let j = 0; j < CHUNK_SIZE; j++) {
      countTransactions++;
      const transaction: Transaction = {
        id: countTransactions,
        transactionType: 'V2_ACCOUNT_SEND',
        reference: `v2:transaction:${faker.string.uuid()}`,
        description: faker.finance.transactionType(),
        destination: faker.string.uuid(),
        amount: faker.number.int({min: 5, max: 100}),
        source: faker.helpers.arrayElement(companies),
      };

      const formanceTransaction = formanceParser(transaction);
      const mysqlTransaction = createQueryMysql(transaction);
      parsedTransactionsFormance.push(formanceTransaction);
      parsedTransactionsMysql.push(mysqlTransaction);
    }

    const formanceTransactions = await createTransactions(parsedTransactionsFormance)

  }

}
main();