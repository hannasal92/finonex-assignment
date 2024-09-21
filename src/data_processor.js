const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database connection config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Hanna12345',
  port: 5432,
});

// path where the server saved the events 
const eventsFilePath = path.join(__dirname, './server_events.jsonl');

// map to save the userid and the revenue , key = userid and value = revenue
const userRevenueMap = new Map();

let buffer = '';

const readStream = fs.createReadStream(eventsFilePath, { encoding: 'utf8', highWaterMark: 1024 * 64 }); // 64KB chunk size

// Process each chunk of data
readStream.on('data', (chunk) => {
  buffer += chunk;

  let lines = buffer.split('\n');

  // save the last line in the buffer
  buffer = lines.pop();

  // Process each complete line
  lines.forEach((line) => {
    if (line.trim()) {
      processEvent(line);
    }
  });
});

// Process the last part of the file when the stream ends
readStream.on('end', async () => {
  if (buffer.trim()) {
    processEvent(buffer);  // Process any remaining data
  }

  console.log('Finished reading events. Updating database...');
  await updateDatabase();
});

// Error handling
readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});

// Function to process each event
function processEvent(line) {
  let event;
  try {
    event = JSON.parse(line);
  } catch (err) {
    console.error(`Invalid JSON: ${line}`);
    return;
  }

  const { userId, name, value } = event;

  if (!userId || !name || typeof value !== 'number') {
    console.error('Invalid event data:', event);
    return;
  }

  let revenueChange = 0;

  if (name === 'add_revenue') {
    revenueChange = value;
  } else if (name === 'subtract_revenue') {
    revenueChange = -value;
  } else {
    console.error('Unknown event name:', name);
    return;
  }

  // add to the map the revenue for every userid
  const currentRevenue = userRevenueMap.get(userId) || 0;
  userRevenueMap.set(userId, currentRevenue + revenueChange);
}

// update the revenue in the database for every user
async function updateDatabase() {
  const client = await pool.connect();

  try {
    // Start a transaction because we have too many users to update the revenue so it is better to use transaction
    await client.query('BEGIN');

    for (const [userId, revenueChange] of userRevenueMap.entries()) {
      
      const queryText = `
        INSERT INTO users_revenue (user_id, revenue)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET revenue = users_revenue.revenue + $2;
      `;

      await client.query(queryText, [userId, revenueChange]);

      console.log(`Updated revenue for user ${userId}: ${revenueChange}`);
    }

    await client.query('COMMIT');
    console.log('Database update completed successfully.');
  } catch (err) {
    console.error('Error updating database:', err);
    await client.query('ROLLBACK');
  } finally {
    client.release();
    pool.end();
  }
}
