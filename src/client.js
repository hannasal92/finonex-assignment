const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const path = require('path');

const eventsFilePath = path.join(__dirname, './events.jsonl');
const BACKEND_URL = 'http://localhost:8000'
// Create a read stream for the events file
const readStream = fs.createReadStream(eventsFilePath);

const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

// Function to send an event to the server
const sendEvent = async (event) => {
  try {
    const response = await axios.post(BACKEND_URL+'/liveEvent', event, {
      headers: {
        'Authorization': 'secret',
        'Content-Type': 'application/json',
      },
    });
    console.log(`Event sent: ${JSON.stringify(event)} - Response: ${response.status}`);
  } catch (error) {
    console.error(`Error sending event: ${JSON.stringify(event)} - Error: ${error.message}`);
  }
};

// Read and process each event from the file
rl.on('line', (line) => {
  let event;
  try {
    event = JSON.parse(line);
  } catch (err) {
    console.error(`invalid json ${line}`)
    return;
  }
  sendEvent(event);
});

rl.on('close', () => {
  console.log('All events have been processed.');
});