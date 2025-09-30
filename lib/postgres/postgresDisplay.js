import client from "./postgresClient.js";

/**
 * Displays logs to console.
 */
async function PostgresOutputLogs() {
   try {
      const res = await client.query("SELECT * FROM logs;");

      res.rows.forEach(row => {
         console.log(row);
      });

   } catch (err) {
      console.error(err);
   } finally {
      await client.end()
   }
   
}

export default PostgresOutputLogs;