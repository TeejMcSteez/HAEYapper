## Goal

I want a basic script that can run on a cron service or in terminal non-stop to get Home Assistant error logs and store them in a postgres database.

This is for personal use but also for anyone that want's a lightweight logger specifically for Home Assistant that uses postgres (my favorite SQL flavor)

## Roadmap

### V1

Currently I have basic fetching (scrape.js), console display (display.js), reset the table (reset.js), initialize the table in the database (init.db), and finally a usable client for all other components (client.js)

For the main program I want to . . . 

1. Query the database to fetch past logs for filtering
2. Take the logs from the REST endpoint and compare them against the database only keeping the new ones (ones that don't match old logs)
3. After I have all my filtered logs, insert them into the postgres table with a timestamp on database for each insert to signify date time of scrape
4. After query is finished ask the user if they would like to see the logs, if so it will write the log information to a file on desktop otherwise -> step 5.
5. Do proper cleanup and then exit the program

#### Add Ons

- Features to remove old data that I don't need (DELETE ... WHERE datetime < proposedDatetime) ✅ -> `<db_type>`Purge.js
- Ability to set a retention length in .env or another method so that it will automatically clean up your database. Ensuring the disk's don't balloon.
- Ability to forward error logs via other methods including . . . 
    - SMB (network shares?)
    - SQLLite (local) ✅
    - MySQL (database)
    - JSON (local)
    - MongoDB (database)

## V2 (If I'm feeling spicy)

Make a basic frontend to do all of this without running daily node commands or setting up a cron job.
Just start the server, and it will handle how often you want to scrape, retention policy and more!

## Current Dependencies

### For Postgres Users

- [node-postgres](https://www.npmjs.com/package/pg)
- [dotenv](https://www.npmjs.com/package/dotenv)

### For Sqllite Users

- [dotenv](https://www.npmjs.com/package/dotenv)

## Current TODO

1. Normalize log parsing/structured output
    - To search from component/level/Warning|Error/etc.
2. CLI Improvement
    - Make clear and concise console commands that preform most used action
    - Also allow flags for output and input of different files when needed (output file, .env file location, etc.)
