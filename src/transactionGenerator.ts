import { fakerPT_BR as faker } from '@faker-js/faker';
import { NumscriptTransaction } from 'formance-numscript-generator/src/types';

function main() {

  const transactions = [];

  const destination = `${faker.string.uuid()}:credit:${faker.string.uuid()}`
  for (let j = 1; j <= 10; j++) {
    transactions.push({
      asset: "BRL/2",
      amount: faker.number.int({max: 1000}),
      sources: [{account: "world"}],
      destinations: [{account: destination}],
    })
  }
  const payload: NumscriptTransaction = {
    send: transactions,
    txMeta: {
      type: 'V2_ACCOUNT_SEND',
      transactionTypeDescription: 'Envio de pontos',
      description: "description",
    },
    accountMeta: {
      [destination]: {
        expirationDate: "2025-11-17T10:20:55Z",
      },
    },
  }



}

