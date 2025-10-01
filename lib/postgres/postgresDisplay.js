import client from "./postgresClient.js";
import fs from "node:fs";
/**
 * Displays logs to console.
 * @param {string} output
 */
async function PostgresOutputLogs(output) {
   try {
      const res = await client.query("SELECT * FROM logs;");
      if (output.toLocaleLowerCase() === "n") {
         res.rows.forEach(row => {
            console.log(row);
         });
      } else if (output.toLowerCase() === "y") {
         const json = JSON.stringify(res.rows, null, 2);
         fs.writeFileSync(`./log_${Date.now()}.txt`, json);
      } else {
         throw new Error("Invalid choice, yes (y) or no (n).")
      }

   } catch (err) {
      console.error(err);
   } finally {
      await client.end()
   }
   
}

export default PostgresOutputLogs;