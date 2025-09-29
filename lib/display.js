import client from "./client.js";
import getPastLogs from "./lib/dbMan.js";

/**
 * @type string
 */


try {
   const res = await getPastLogs();

   res.rows.forEach(row => {
      console.log(row);
   });

} catch (err) {
   console.error(err);
} finally {
   await client.end()
}
process.exit(1);