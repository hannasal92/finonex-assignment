### Brief
this project have 3 main files the clients.js the extract the events from events.jsonl file and send to them to the server , server.js that have middleware to check the authintication secret word and two route one to insert the events to server_events.jsonl and the other route to get the data from the db , and the third file is data_processor.js that get all the events from the file server_events.jsonl and calculate the revenue and save the result in map then update the value in the db . we can pass to the data processor the file name by the command node src/data_processor.js 'FILENAME' .

## Prerequisites
Ensure the following are installed on your system:

Node.js (v12+)
PostgreSQL (v12+)
NPM (Node Package Manager)

## DB 
postgres DB that have one table called users_revenue ,two columns revenue and userid is the primary key (no need to add index to a priary key to help us in the search because by default the primary key have an index)

## Stack
nodejs
express
pg (PostgreSQL client for Node.js)

## Setup
1. git clone https://github.com/hannasal92/finonex-assignment.git

2. npm install

3. Configure PostgreSQL
Set up your PostgreSQL database and create the necessary table:
CREATE TABLE IF NOT EXISTS users_revenue (
    user_id VARCHAR(255) PRIMARY KEY,
    revenue INTEGER DEFAULT 0
);



4. Update Database Connection
 - in server.js and data_processor.js
const pool = new Pool({
  user: 'your-username',       
  host: 'localhost',
  database: 'your-database', 
  password: 'your-password',
  port: 5432,
});

5. Create Events File

## In order to run the project, run the following commands
`npm install`
`npm run dev` to run the server
`node src/client.js` to run the client
`node src/data_processor.js server_events.jsonl` to run the data processor and pass the filename where the events saved (can pass another filename)
`node src/data_processor.js server_events.jsonl &; node src/data_processor.js server_events.jsonl &` to run multiple data_processor

## Developed by
Hanna Salameh

