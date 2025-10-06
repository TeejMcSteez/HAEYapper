## Goal

I want a basic script that can run on a cron service or in terminal non-stop to get Home Assistant error logs and store them in a postgres database.

This is for personal use but also for anyone that want's a lightweight logger specifically for Home Assistant that runs on Node apart from Home Assistant as it only touches the REST endpoint to fetch logs.

## Roadmap

### V1

#### CLI

Allows user to setup schedule jobs, scrape and upload to database, setup rentention policy, purge logs, or reset the table.

#### Server

- /logs/get - Gets all logs in table and returns as JSON.
- /logs/purge/:timespan/:interval - Purges logs within a given timespan and interval.
- /logs/scrape - Get's logs from REST endpoint, split logs, and uploads to database.
- /schedule/:second/:minute/:hour/:dom/:mon/:dow - Schedules a scrape job in the future.
- /schedule - Loads the schedule from schedule.json.
- /schedule/destroy - Kills all's current jobs and destroys their schedule in memory.


## V2 (If I'm feeling spicy)

Make a basic frontend to do all of this without running daily node commands or setting up a cron job.
Just start the server, and it will handle how often you want to scrape, retention policy and more!

## Current Dependencies

Currently only postgres and sqlite databases are available and may be the only options, postgres is used for over the network storage and sqlite is used for completely local storage of data.

For postgres I use node-postgres linked below.

For sqlite I use Node's built in sqlite module, while it is experimental it is relatively nice and is less packages to install as it comes shipped with all node versions required for this module.

dotenv is used to load information stored in configuration files

For the web server I use Hono as it is light, simple, and claims multi-runtime

To schedule scrape job I use node-cron for a clean api and cleanup

[node-cron](https://www.npmjs.com/package/node-cron)

[Hono](https://hono.dev/)

[dotenv](https://www.npmjs.com/package/dotenv)

[Mocha](https://mochajs.org/) -  Testing library

### For Postgres Users

- [node-postgres](https://www.npmjs.com/package/pg)

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
PRUNE="3 day" # Deletes logs older than given timespan, can be day/hour.
```

## Current TODO

- Further Mocha test's to verify functionality.
- KISS, Scrape does to much split functionality into more components for easier testing. (remove error handling as splitLogs handles newlines and blank strings now)

## Research

- Websocket connection with homeassistant either with option to setup scrape on publish or to use only websocket connection [Node Websocket](https://nodejs.org/en/learn/getting-started/websocket), [HAWebsocket Docs](https://developers.home-assistant.io/docs/api/websocket/)

## Notes

Home Assistant websocket API did not directly expose an endpoint for error logs, while I might have mis-read I do not think it allows subscriptions to system logs without a user setting it up so for now I will prob. bench websocket connection to HA as it will require a third party library and requires user setup on HA which is more work than install and run.