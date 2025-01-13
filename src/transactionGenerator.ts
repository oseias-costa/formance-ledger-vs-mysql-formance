import { fakerPT_BR as faker } from '@faker-js/faker';
import { NumscriptTransaction } from 'formance-numscript-generator/src/types';
import { generateNumscript } from 'formance-numscript-generator/src';

function main() {

  const transactions = [];
  const companies: string[] = [];


  // const destination = `${faker.string.uuid()}:credit:${faker.string.uuid()}`
  for (let j = 1; j <= 10; j++) {
    const destination = faker.string.uuid();
    transactions.push({
      asset: 'BRL/2',
      amount: 10000000,
      sources: [{ account: 'world' }],
      destinations: [{ account: destination }],
    });
    companies.push(destination);
  }



  const payload: NumscriptTransaction = {
    send: transactions,
    txMeta: {
      type: 'V2_ACCOUNT_SEND',
      transactionTypeDescription: 'Envio de pontos',
      description: 'description',
    },
  };

  const parsedPayload = generateNumscript(payload)
  const transaction = {
    refreference: `v2:transaction:${faker.string.uuid()}`,
    timestamp: "2022-11-17T10:20:55Z",
    script: {
      plain: parsedPayload,
    },
  }


}
