import { NumscriptTransaction } from 'formance-numscript-generator/src/types';
import { generateNumscript } from 'formance-numscript-generator/src';
import { Transaction } from './types';

export function formanceParser(transaction: Transaction) {
  const formanceTransaction = {
    amount: transaction.amount,
    sources: [{ account: transaction.source }],
    destinations: [{ account: transaction.destination }],
    asset: 'BRL/2',
  };
  const payload: NumscriptTransaction = {
    send: [formanceTransaction],
    txMeta: {
      type: transaction.transactionType,
      description: transaction.description,
    },
  };
  const parsedPayload = generateNumscript(payload);

  return {
    refreference: transaction.reference,
    timestamp: '2021-11-17T10:20:55Z',
    script: {
      plain: parsedPayload,
    },
  };
}
