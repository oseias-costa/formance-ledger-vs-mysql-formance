import { fakerPT_BR as faker } from '@faker-js/faker';
import { NumscriptTransaction } from 'formance-numscript-generator/src/types';
import { generateNumscript } from 'formance-numscript-generator/src';
import { Transaction, TransactionType } from './types';

function main() {

  const transactions = [];
  const companies: string[] = [];


  for (let j = 1; j <= 10; j++) {
    const transaction: Transaction = {
      id: faker.number.int(),
      transactionType: 'V2_ACCOUNT_SEND',
      reference: `v2:transaction:${faker.string.uuid()}`,
      description: faker.finance.transactionType(),
      destination: faker.string.uuid(),
      amount: 10000000,
      source: 'world'
    }
    transactions.push(transaction);
    companies.push(transaction.destination)
  }
}
