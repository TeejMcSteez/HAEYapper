import client from "./client.js";

/**
 * Displays logs to console.
 */
async function OutputLogs() {
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
   process.exit(1);
}

export default OutputLogs;