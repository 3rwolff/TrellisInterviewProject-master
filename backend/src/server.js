const express = require('express');
var bodyParser = require('body-parser');//added middleware to parse POST body
console.log("%%% server.js was called. %%%");
// In-memory 'database' object
const db = {
  sensors: [
    {
      id: 1,
      name: 'North Sensor',
      description: 'The sensor in the north',
      notes: [
        {
          note_id: 1,
          date: '2011-04-19',
          note_body: "North Sensor Note 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
        },
        {
          note_id: 2,
          date: '2012-04-19',
          note_body: "North Sensor Note 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
      ]
    },
    {
      id: 2,
      name: 'South Sensor',
      description: 'The south field sensor',
      notes: [
        {
          note_id: 1,
          date: '2021-04-19',
          note_body: "South Sensor Note 1."
        },
        {
          note_id: 2,
          date: '2022-04-19',
          note_body: "South Sensor Note 2."
        },
        {
          note_id: 3,
          date: '2023-04-19',
          note_body: "South Sensor Note 3."
        }
      ]
    },
    {
      id: 3,
      name: 'East Sensor',
      description: 'The sensor on the east side',
      notes: [
        {
          note_id: 1,
          date: '2031-04-19',
          note_body: "East Sensor Note 1."
        }
      ]
    },
    {
      id: 4,
      name: 'West Sensor',
      description: 'The western most sensor',
      notes: [
        {
          note_id: 1,
          date: '2041-04-19',
          note_body: "West Sensor Note 1."
        }
      ]
    }
  ]
};

// Create express app
const app = express();
app.use(bodyParser.json());//added to help parse POST body

app.use(function(req, res, next) {
  // Allow CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/sensors', (req, res) => {
  // Return all sensors
  res.json(db.sensors);
  res.sendStatus(200);//successfull
});

//added route to get specified sensor details
app.get('/selectedSensor', (req, res) => {
  // Return specified sensor
  console.log(`%%% selectedSensor route was called for id: ${req.query.id} %%%`);
  res.json( db.sensors[req.query.id - 1]);//adjust for first array element
  res.sendStatus(200);//successfull
});

//added route to save a note
app.post('/saveNote', (req, res) => {
  console.log(`%%% saveNote() was called %%%`);
 
  var new_note_index = db.sensors[req.body.id - 1].notes.length + 1;
  var today = new Date().toISOString().slice(0, 10);

  //save note in in-memory db constant
  db.sensors[req.body.id - 1].notes.push({ 
                            id: new_note_index, 
                            date: today, 
                            note_body: req.body.notebody 
                          });

  res.sendStatus(201);//created successfully
});

//added route to delete a note
app.post('/deleteNote', (req, res) => {
  console.log(`%%% deleteNote() was called %%%`);
  
  //remove selected note
  db.sensors[req.body.id - 1].notes.splice(req.body.note_id - 1, 1);
  res.sendStatus(200);//successfull
});

const PORT = 9000;
app.listen(PORT);
console.log('Express listening on port ' + PORT);
