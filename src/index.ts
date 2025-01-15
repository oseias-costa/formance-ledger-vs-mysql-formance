import { createTransaction, startLedger } from "./formance.api";
import { createMysqlTransaction, pool } from "./mysql";
import { transactionGenerator } from "./transactionGenerator";
import { ProgressBar } from "@opentf/cli-pbar";
import { splitIntoBatches } from "./utils";
import { Worker } from "worker_threads";

const BATCHSIZE = 3;
const COMPANYS = 10;
const TRASNSACTIONS_USERS = 300;
const TOTAL_INSERTS = COMPANYS * TRASNSACTIONS_USERS;
const TOTAL_BAR = (TOTAL_INSERTS + BATCHSIZE) * 2;

async function main() {
  const multiPBar = new ProgressBar({ size: "MEDIUM" });
  console.time("mysql");

  const lastMysqlId = await pool.query(
    "SELECT `id`from ledger.`Transaction` ORDER BY `id` DESC LIMIT 1;",
  );

  const { mysqlQueries, numscripts } = transactionGenerator(
    COMPANYS,
    TRASNSACTIONS_USERS,
    lastMysqlId ? lastMysqlId[0][0]?.id : 0,
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

  console.timeEnd("mysql");

  multiPBar.stop();
  console.log("Complete Inserts");
}

main();
