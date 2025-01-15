"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formance_api_1 = require("./formance.api");
const mysql_1 = require("./mysql");
const transactionGenerator_1 = require("./transactionGenerator");
const cli_pbar_1 = require("@opentf/cli-pbar");
const utils_1 = require("./utils");
const BATCHSIZE = 10;
const COMPANYS = 10;
const TRASNSACTIONS_USERS = 10;
const TOTAL_INSERTS = COMPANYS * TRASNSACTIONS_USERS;
const TOTAL_BAR = (TOTAL_INSERTS + BATCHSIZE) * 2;
async function main() {
    const multiPBar = new cli_pbar_1.ProgressBar({ size: "MEDIUM" });
    const { mysqlQueries, numscripts } = (0, transactionGenerator_1.transactionGenerator)(COMPANYS, TRASNSACTIONS_USERS);
    const b1 = multiPBar.add({ total: TOTAL_BAR });
    const b2 = multiPBar.add({ total: TOTAL_BAR });
    const iteratorCount = { numscript: 0, mysql: 0 };
    multiPBar.start();
    console.time("query-transactions");
    const batchesFormance = (0, utils_1.splitIntoBatches)(numscripts, BATCHSIZE);
    const batchesMysql = (0, utils_1.splitIntoBatches)(mysqlQueries, BATCHSIZE);
    try {
        await (0, formance_api_1.startLedger)();
        for (const batch of batchesFormance) {
            iteratorCount.numscript += 1;
            b1.update({ value: iteratorCount.numscript });
            await Promise.all(batch.map((transaction) => {
                iteratorCount.numscript += 1;
                b1.update({ value: iteratorCount.numscript });
                return (0, formance_api_1.createTransaction)(transaction);
            }));
        }
    }
    catch (err) {
        console.log("Formance error: ", err);
    }
    try {
        for (const batch of batchesMysql) {
            iteratorCount.mysql += 1;
            b2.update({ value: iteratorCount.mysql });
            await Promise.all(batch.map((transaction) => {
                iteratorCount.mysql += 1;
                b2.update({ value: iteratorCount.mysql });
                return (0, mysql_1.createMysqlTransaction)(transaction);
            }));
        }
    }
    catch (err) {
        console.log("Mysql error: ", err);
    }
    console.log(iteratorCount);
    console.timeEnd("query-transactions");
    multiPBar.stop();
    console.log("Complete Inserts");
}
main();
//# sourceMappingURL=index.js.map