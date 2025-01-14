import { fakerPT_BR as faker } from "@faker-js/faker";
import { Transaction } from "./types";
import { createMysqlTransaction, createQueryMysql } from "./mysql";

async function main() {
  const transaction: Transaction = {
    id: faker.number.int({ max: 2000 }),
    transactionType: "V2_ACCOUNT_SEND",
    reference: `v2:transaction:${faker.string.uuid()}`,
    description: faker.finance.transactionType(),
    destination: faker.string.uuid(),
    amount: 100,
    source: "world",
  };

  const query = createQueryMysql(transaction);

  console.log(query);

  try {
    await createMysqlTransaction(query);
  } catch (err) {
    console.log("errr", err);
  }

  console.log("Script works");
}

main();
