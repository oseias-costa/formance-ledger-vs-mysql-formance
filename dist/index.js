"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formance_api_js_1 = require("./formance.api.js");
const mysql_js_1 = require("./mysql.js");
const transactionGenerator_1 = require("./transactionGenerator");
const cli_pbar_1 = require("@opentf/cli-pbar");
const utils_1 = require("./utils");
const BATCHSIZE = 3;
const COMPANIES = 10;
const TRASNSACTIONS_PER_USERS = 3;
const TOTAL_INSERTS = COMPANIES * TRASNSACTIONS_PER_USERS;
const TOTAL_BAR = (TOTAL_INSERTS + BATCHSIZE) * 2;
async function main() {
    const multiPBar = new cli_pbar_1.ProgressBar({ size: "MEDIUM" });
    console.time("mysql");
    const lastMysqlId = await mysql_js_1.pool.query("SELECT `id`from ledger.`Transaction` ORDER BY `id` DESC LIMIT 1;");
    const { mysqlQueries, numscripts } = (0, transactionGenerator_1.transactionGenerator)(COMPANIES, TRASNSACTIONS_PER_USERS, lastMysqlId ? lastMysqlId[0][0]?.id : 0);
    const batchesFormance = (0, utils_1.splitIntoBatches)(numscripts, BATCHSIZE);
    const batchesMysql = (0, utils_1.splitIntoBatches)(mysqlQueries, BATCHSIZE);
    const b1 = multiPBar.add({ total: batchesFormance.length * TOTAL_BAR });
    const b2 = multiPBar.add({ total: batchesFormance.length + TOTAL_BAR });
    const iteratorCount = { numscript: 0, mysql: 0 };
    multiPBar.start();
    try {
        await (0, formance_api_js_1.startLedger)();
        for (const batch of batchesFormance) {
            iteratorCount.numscript += 1;
            // b1.update({ value: iteratorCount.numscript });
            await Promise.all(batch.map((transaction) => {
                iteratorCount.numscript += 1;
                b1.update({ value: iteratorCount.numscript });
                return (0, formance_api_js_1.createTransaction)(transaction);
            }));
        }
    }
    catch (err) {
        console.log("Formance error: ", err);
    }
    try {
        for (const batch of batchesMysql) {
            iteratorCount.mysql += 1;
            // b2.update({ value: iteratorCount.mysql });
            await Promise.all(batch.map((transaction) => {
                iteratorCount.mysql += 1;
                b2.update({ value: iteratorCount.mysql });
                return (0, mysql_js_1.createMysqlTransaction)(transaction);
            }));
        }
    }
    catch (err) {
        console.log("Mysql error: ", err);
    }
    console.timeEnd("mysql");
    console.log(iteratorCount);
    multiPBar.stop();
    console.log("Complete Inserts");
    process.exit(0);
}
main();
//# sourceMappingURL=index.js.map