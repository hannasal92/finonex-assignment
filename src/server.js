const express = require('express');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = 8000;

app.use(express.json()); // Middleware to parse JSON bodies

// Database connection configuration
const pool = new Pool({
  user: 'postgres',         // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'postgres',     // Replace with your PostgreSQL database name
  password: 'Hanna12345', // Replace with your PostgreSQL password
  port: 5432,                   // Default PostgreSQL port
});

// File to store incoming events
const eventsFilePath = path.join(__dirname, './server_events.jsonl');
// get the query from db.sql ;
// var user_revenue_query = fs.readFileSync(__dirname+'/db.sql').toString()

const auth = async (req, res, next) => {
    const header_auth = req.headers['authorization'] ;

    if (header_auth !== 'secret') {
        return res.status(401).send('Unauthorized');
    }
    next();

}

//route 1 that insert the events inside the jsonl file
app.post('/liveEvent', auth, (req, res) => {

  const event = req.body;

  // Validate event data
  if (
    !event.userId ||
    !event.name ||
    typeof event.value !== 'number'
  ) {
    return res.status(400).send('Invalid event data');
  }

  // Append the event to the local file
  const eventLine = JSON.stringify(event);
  fs.appendFile(eventsFilePath, eventLine + '\n', (err) => {
    if (err) {
      console.error('Error writing to event file:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Event received');
  });
});

// route 2: get the data for a specefic user from the db
app.get('/userEvents/:userid', auth, async (req, res) => {
  const userId = req.params.userid;
  try {
    const result = await pool.query(
      'SELECT user_id, revenue FROM users_revenue WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  //try{
    // we can run the query to create table in DB but we can do it manually in the DB
    // await pool.query(user_revenue_query);
  // }catch(err){
  //   console.error('error in creating the table in the db');
  // }
});