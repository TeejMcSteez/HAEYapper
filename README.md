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

- Ability to set a retention length in .env or another method so that it will automatically clean up your database. Ensuring the disk's don't balloon.

## V2 (If I'm feeling spicy)

Make a basic frontend to do all of this without running daily node commands or setting up a cron job.
Just start the server, and it will handle how often you want to scrape, retention policy and more!

## Current Dependencies

Currently only postgres and sqlite databases are available and may be the only options, postgres is used for over the network storage and sqlite is used for completely local storage of data.

For postgres I use node-postgres linked below.

For sqlite I use Node's built in sqlite module, while it is experimental it is relatively nice and is less packages to install as it comes shipped with all node versions required for this module.

dotenv is used to load information stored in configuration files

### For Postgres Users

- [node-postgres](https://www.npmjs.com/package/pg)
- [dotenv](https://www.npmjs.com/package/dotenv)

### For Sqllite Users

- [dotenv](https://www.npmjs.com/package/dotenv)

## Configuration File (.env)

```yml
# Home Assistant Information
HA_TOKEN=<Bearer-Token>
HA_HOST=<example.com>
# Postgres Database Information
DB_USER=user
DB_PASSWORD=password
DB_HOST=<example.com>
DB_PORT=5432
DB_DB=halogs
# Runtime Info
# Currently supports postgres or sqlite
DB_TYPE=postgres
```

## Current TODO

- Add rentention length to .env and on startup of CLI and server Purge all logs older than set retention length
- Refactor split logs to only returns non-empty or non-newline logs to stop handling it in function

## Research

- Websocket connection with homeassistant either with option to setup scrape on publish or to use only websocket connection
- Automated testing