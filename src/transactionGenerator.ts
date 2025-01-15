import { fakerPT_BR as faker } from "@faker-js/faker";
import { Transaction } from "./types";
import { createQueryMysql } from "./mysql";
import { formanceParser } from "./numscriptParser";

export function transactionGenerator(
  companys: number,
  transactionsUsers: number,
  lastId: number,
) {
  const mysqlQueries = [];
  const numscripts = [];

  let id = lastId ?? 0;

  for (let i = 1; i <= companys; i++) {
    id += 1;
    const company = faker.string.uuid();
    const user = faker.string.uuid();

    const transaction: Transaction = {
      id,
      transactionType: "V2_ADD_POINTS",
      reference: `v2:transaction:${faker.string.uuid()}`,
      description: "Compra de pontos",
      destination: company,
      amount: 20000000,
      source: "world",
    };

    mysqlQueries.push(createQueryMysql(transaction));
    numscripts.push(formanceParser(transaction));

    for (let j = 1; j <= transactionsUsers; j++) {
      id += 1;
      const userTransaction: Transaction = {
        id,
        transactionType: "V2_ACCOUNT_SEND",
        reference: `v2:transaction:${faker.string.uuid()}`,
        description: faker.finance.accountName(),
        destination: user,
        amount: faker.number.float({ max: 15, min: 1 }),
        source: company,
      };

      mysqlQueries.push(createQueryMysql(userTransaction));
      numscripts.push(formanceParser(transaction));
    }
  }

  return { mysqlQueries, numscripts };
}
