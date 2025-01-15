import { createTransaction, startLedger } from "./formance.api.js";
import { createMysqlTransaction, pool } from "./mysql.js";
import { transactionGenerator } from "./transactionGenerator";
import { ProgressBar } from "@opentf/cli-pbar";
import { splitIntoBatches } from "./utils";

const BATCHSIZE = 3;
const COMPANIES = 10;
const TRASNSACTIONS_PER_USERS = 3;
const TOTAL_INSERTS = COMPANIES * TRASNSACTIONS_PER_USERS;
const TOTAL_BAR = (TOTAL_INSERTS + BATCHSIZE) * 2;

async function main() {
  const multiPBar = new ProgressBar({ size: "MEDIUM" });
  console.time("transactions");

  const lastMysqlId = await pool.query(
    "SELECT `id`from ledger.`Transaction` ORDER BY `id` DESC LIMIT 1;",
  );

  const { mysqlQueries, numscripts } = transactionGenerator(
    COMPANIES,
    TRASNSACTIONS_PER_USERS,
    lastMysqlId ? lastMysqlId[0][0]?.id : 0,
  );

  const batchesFormance = splitIntoBatches(numscripts, BATCHSIZE);
  const batchesMysql = splitIntoBatches(mysqlQueries, BATCHSIZE);

  const b1 = multiPBar.add({ total: batchesFormance.length * TOTAL_BAR });
  const b2 = multiPBar.add({ total: batchesFormance.length + TOTAL_BAR });
  const iteratorCount = { numscript: 0, mysql: 0 };

  multiPBar.start();

  try {
    await startLedger();
    for (const batch of batchesFormance) {
      iteratorCount.numscript += 1;
      // b1.update({ value: iteratorCount.numscript });

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
      // b2.update({ value: iteratorCount.mysql });

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

  console.timeEnd("transactions");
  multiPBar.stop();
  console.log("Complete Inserts");

  process.exit(0);
}

main();
