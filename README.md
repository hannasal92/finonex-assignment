### Brief
this project have 3 main files the clients.js the extract the events from events.jsonl file and send to them to the server , server.js that have middleware to check the authintication secret word and two route one to insert the events to server_events.jsonl and the other route to get the data from the db , and the third file is data_processor.js that get all the events from the file server_events.jsonl and calculate the revenue and save the result in map then update the value in the db . we can pass to the data processor the file name by the command node src/data_processor.js 'FILENAME' .

## DB 
postgres DB that have one table called users_revenue ,two columns revenue and userid is the primary key (no need to add index to a priary key to help us in the search because by default the primary key have an index)

## Stack
nodejs
express
postgres

## In order to run the project, run the following commands
`npm install`
`npm run dev` to run the server
`node src/client.js` to run the client
`node src/data_processor.js server_events.jsonl` to run the data processor and pass the filename where the events saved (can pass another filename)
`node src/data_processor.js server_events.jsonl &; node src/data_processor.js server_events.jsonl &` to run multiple data_processor

## Developed by
Hanna Salameh

