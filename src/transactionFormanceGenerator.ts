import { fakerPT_BR as faker } from '@faker-js/faker';
import { Transaction } from './types';
import { formanceParser } from './numscriptParser';
import { createTransaction, startLedger } from './formance.api';

async function main() {

  const transactions = [];
  const companies: string[] = [];


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


  for (let i = 0; i < 3; i++) {

    const user = faker.string.uuid();
    users.push(user);

    const promises = [];
    for (let j = 0; j < 1000; j++) {
      const transaction: Transaction = {
        id: j,
        transactionType: 'V2_ACCOUNT_SEND',
        reference: `v2:transaction:${faker.string.uuid()}`,
        description: faker.finance.transactionType(),
        destination: `user:credit:${faker.string.uuid()}`,
        amount: faker.number.int({min: 5, max: 100}),
        source: companies[0],
      };

      const formanceTransaction = formanceParser(transaction);
      promises.push(createTransaction(formanceTransaction));
    }
    console.log(`Start of batch ${i}`)
    const startTime = performance.now();
    await Promise.all(promises);
    const endTime = performance.now();
    console.log(`End of batch ${i} - ${endTime - startTime}`);

  }
}


main();