import { createTransaction, startLedger } from "./formance.api";
import { createMysqlTransaction } from "./mysql";
import { transactionGenerator } from "./transactionGenerator";
import { ProgressBar } from "@opentf/cli-pbar";
import { splitIntoBatches } from "./utils";

const BATCHSIZE = 10;
const COMPANYS = 10;
const TRASNSACTIONS_USERS = 10;
const TOTAL_INSERTS = COMPANYS * TRASNSACTIONS_USERS;
const TOTAL_BAR = (TOTAL_INSERTS + BATCHSIZE) * 2;

async function main() {
  const multiPBar = new ProgressBar({ size: "MEDIUM" });

  const { mysqlQueries, numscripts } = transactionGenerator(
    COMPANYS,
    TRASNSACTIONS_USERS,
  );

  const b1 = multiPBar.add({ total: TOTAL_BAR });
  const b2 = multiPBar.add({ total: TOTAL_BAR });
  const iteratorCount = { numscript: 0, mysql: 0 };

  multiPBar.start();

  const batchesFormance = splitIntoBatches(numscripts, BATCHSIZE);
  const batchesMysql = splitIntoBatches(mysqlQueries, BATCHSIZE);

  try {
    await startLedger();
    for (const batch of batchesFormance) {
      iteratorCount.numscript += 1;
      b1.update({ value: iteratorCount.numscript });

      await Promise.all(
        batch.map((transaction: string) => {
          iteratorCount.numscript += 1;
          b1.update({ value: iteratorCount.numscript });

          return createTransaction(transaction);
        }),
      );
    }
  } catch (err) {
    console.log("Formance error: ", err);
  }

  try {
    for (const batch of batchesMysql) {
      iteratorCount.mysql += 1;
      b2.update({ value: iteratorCount.mysql });

      await Promise.all(
        batch.map((transaction: string) => {
          iteratorCount.mysql += 1;
          b2.update({ value: iteratorCount.mysql });

          return createMysqlTransaction(transaction);
        }),
      );
    }
  } catch (err) {
    console.log("Mysql error: ", err);
  }

  multiPBar.stop();
  console.log("Complete Inserts");
}

main();
