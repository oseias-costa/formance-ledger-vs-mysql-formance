"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formance_api_1 = require("./formance.api");
const mysql_1 = require("./mysql");
const transactionGenerator_1 = require("./transactionGenerator");
const cli_pbar_1 = require("@opentf/cli-pbar");
const utils_1 = require("./utils");
const BATCHSIZE = 3;
const COMPANYS = 10;
const TRASNSACTIONS_USERS = 300;
const TOTAL_INSERTS = COMPANYS * TRASNSACTIONS_USERS;
const TOTAL_BAR = (TOTAL_INSERTS + BATCHSIZE) * 2;
async function main() {
    const multiPBar = new cli_pbar_1.ProgressBar({ size: "MEDIUM" });
    console.time("mysql");
    const lastMysqlId = await mysql_1.pool.query("SELECT `id`from ledger.`Transaction` ORDER BY `id` DESC LIMIT 1;");
    const { mysqlQueries, numscripts } = (0, transactionGenerator_1.transactionGenerator)(COMPANYS, TRASNSACTIONS_USERS, lastMysqlId ? lastMysqlId[0][0]?.id : 0);
    const b1 = multiPBar.add({ total: TOTAL_BAR });
    const b2 = multiPBar.add({ total: TOTAL_BAR });
    const iteratorCount = { numscript: 0, mysql: 0 };
    multiPBar.start();
    const batchesFormance = (0, utils_1.splitIntoBatches)(numscripts, BATCHSIZE);
    const batchesMysql = (0, utils_1.splitIntoBatches)(mysqlQueries, BATCHSIZE);
    const processTransaction = (transactions, createFn) => {
        for (const transaction of transactions) {
            createFn(transaction);
        }
    };
    for (let i = 0; i < batchesFormance.length; i++) {
        b1.update({ value: i });
        await Promise.all([
            processTransaction(batchesFormance[i], formance_api_1.createTransaction),
            processTransaction(batchesMysql[i], mysql_1.createMysqlTransaction),
        ]);
    }
    // try {
    //   await startLedger();
    //   for (const batch of batchesFormance) {
    //     iteratorCount.numscript += 1;
    //     b1.update({ value: iteratorCount.numscript });
    //
    //     await Promise.all([
    //       batch.map((transaction: string) => {
    //         iteratorCount.numscript += 1;
    //         b1.update({ value: iteratorCount.numscript });
    //
    //         return createTransaction(transaction);
    //       }),
    //     ]);
    //   }
    // } catch (err) {
    //   console.log("Formance error: ", err);
    // }
    //
    // try {
    //   await startLedger();
    //   for (const batch of batchesFormance) {
    //     iteratorCount.numscript += 1;
    //     b1.update({ value: iteratorCount.numscript });
    //
    //     await Promise.all(
    //       batch.map((transaction: string) => {
    //         iteratorCount.numscript += 1;
    //         b1.update({ value: iteratorCount.numscript });
    //
    //         return createTransaction(transaction);
    //       }),
    //     );
    //   }
    // } catch (err) {
    //   console.log("Formance error: ", err);
    // }
    // try {
    //   for (const batch of batchesMysql) {
    //     iteratorCount.mysql += 1;
    //     b2.update({ value: iteratorCount.mysql });
    //
    //     await Promise.all(
    //       batch.map((transaction: string) => {
    //         iteratorCount.mysql += 1;
    //         b2.update({ value: iteratorCount.mysql });
    //
    //         return createMysqlTransaction(transaction);
    //       }),
    //     );
    //   }
    // } catch (err) {
    //   console.log("Mysql error: ", err);
    // }
    console.timeEnd("mysql");
    multiPBar.stop();
    console.log("Complete Inserts");
}
main();
//# sourceMappingURL=index.js.map