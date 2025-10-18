## Goal

A script that can run as a server, process, or system job to routinely scrape Home Assistant error logs from the REST endpoint break up the data into useful information and store that information in a numerous types of database implementations.

Current Commands:

- `pnpm cli` - Runs a setup script ask's to setup schedule, scrape, etc.
- `pnpm serve` - Start's a small HTTP server using Hono with endpoint's to access functionality
- `pnpm runner` - After file configuration and CLI setup a "set it and leave it" option where the process wait's for the cron schedule, interrupt/termination signal, or error.

Auxillary Commands:

- `pnpm test` - Run's test scripts using Mocha

### V1

#### Server

- /logs/get - Gets all logs in table and returns as JSON.
- /logs/purge/:timespan/:interval - Purges logs within a given timespan and interval.
- /logs/scrape - Get's logs from REST endpoint, split logs, and uploads to database.
- /schedule/:second/:minute/:hour/:dom/:mon/:dow - Schedules a scrape job in the future.
- /schedule - Loads the schedule from schedule.json.

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
- Have a better event loop rather than `while(true) { func() };` such as:
    1. Health checks (cron heartbeat, file integrity, etc.)

### Database Add-On List

1. MySQL [Driver](https://www.npmjs.com/package/mysql2)
2. MongoDB [Driver](https://www.npmjs.com/package/mongodb)
3. MariaDB? [Driver](https://github.com/mariadb-corporation/mariadb-connector-nodejs)

## Research

- Websocket connection with homeassistant either with option to setup scrape on publish or to use only websocket connection [Node Websocket](https://nodejs.org/en/learn/getting-started/websocket), [HAWebsocket Docs](https://developers.home-assistant.io/docs/api/websocket/)

- MariaDB Driver for MySQL2 replacement + MariaDB [Docs](https://www.npmjs.com/package/mariadb) [GitHub](https://github.com/mariadb-corporation/mariadb-connector-nodejs)

## Notes

Home Assistant websocket API did not directly expose an endpoint for error logs, while I might have mis-read I do not think it allows subscriptions to system logs without a user setting it up so for now I will prob. bench websocket connection to HA as it will require a third party library and requires user setup on HA which is more work than install and run.

The MariaDB driver claims to be able work as MySQL2, be faster, and work with MariaDB which if I do choose this would allow me to use basically the same code for MariaDB and MySQL while offering users more choices in databases as currently there are only 2 both being SQL. 5 options with one being a NoSQL database should offer anyone that want's to use it enough options to get started as they can keep it local with Sqlite, install MariaDB or MySQL for that flavor, use Postgres for the ***correct*** flavor, and for NoSQL user's MongoDB I assume would be the most popular as Redis being in memory defeats the purpose, Cassandra seems overkill for a logger (if you want it I'll do it), and I've never used Elasticsearch but not sure the use case.

## V2 (If I'm feeling spicy)

Make a basic frontend to do all of this without running daily node commands or setting up a cron job.
Just start the server, and it will handle how often you want to scrape, retention policy and more!