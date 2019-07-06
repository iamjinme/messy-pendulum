const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

const User = require('./User.js');
const today


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api', (req, res, next) => {
  res.send({ ok: true });
})

app.post('/api/exercise/new-user', (req, res, next) => {
  const { username } = req.body;
  if (!username) res.status(400).send({ error: 'BAD_REQUEST' });
  const user = new User({ username });
  user.save((err, data) => {
    if (err) res.status(500).send({ error: err });
    res.json({ username, _id: user.id });  
  });
})

app.get('/api/exercise/users', (req, res, next) => {
  User.find({}, function(err, data) {
    if (err) res.status(500).send({ error: err });
    const users = data.map((user) => ({ _id: user.id, username: user.username }));
    res.json(users);
  });
})

app.post('/api/exercise/add', (req, res, next) => {
  const { userId, description, duration, date } = req.body;
  if (!userId || !description || !duration) res.status(400).send({ error: 'BAD_REQUEST' });
  // ToDo: create date if empty
  User.findById(userId, (err, data) => {
    if (err) res.status(500).send({ error: err });
    if (!data) res.status(404).send({ error: 'NOT_FOUND' });
    const add = {
      description,
      duration,
      date,
    };
    data.exercise = [...data.exercise, add];
    data.save((err, data) => {
      if (err) res.status(500).send({ error: err });
      res.json(data);
    });
  });
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})