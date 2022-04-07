const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'Martin',
      password : '0321',
      database : 'face-recognition'
    }
  });

const app = express();

app.use(express.json())    // Substitute for Body parser, which is now included in Express
app.use(cors())

// Basic check of server
app.get('/', (req, res) => {
    res.send('Success, server is running and responding')
})

// SIGNIN
app.post('/signin', (req, res)  => { signin.handleSignin(req, res, db, bcrypt) })

// REGISTER
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// GET PROFILE - not used yet, bet ready for user management
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

// Incrementing entries in DB
app.put('/image', (req, res) => { image.handleImage(req, res, db)})

app.listen(3001, () => {
    console.log('app is running on port 3001');
})