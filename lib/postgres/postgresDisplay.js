import client from "./postgresClient.js";
import postgresGetLogs from "./postgresGetLogs.js";
import fs from "node:fs";
/**
 * Displays logs to console.
 * @param {string} ans - Whether or not to write output to file
 * @param {string?} filename - given name to the log file
 */
async function Output(ans, filename) {
   const conn = await client.connect();
   try {
      const res = await postgresGetLogs();
      if (ans.toLocaleLowerCase() === "n") {
         res.rows.forEach(row => {
            console.log(`[postgres]`, row, "\n");
         });
      } else if (ans.toLowerCase() === "y") {
         const json = JSON.stringify(res.rows, null, 2);
         fs.writeFileSync(`./${filename === ''? 'log': filename}_${Date.now()}.json`, json);
      } else {
         throw new Error("[postgres] Invalid choice, yes (y) or no (n).")
      }

   } catch (err) {
      console.error(`[postgres] ${err}`);
   } finally {
      conn.release();
   }
   
}

export default Output;