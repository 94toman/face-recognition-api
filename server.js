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
      host : 'ec2-34-192-210-139.compute-1.amazonaws.com',
      port : 5432,
      user : 'oeydwmfgoixtcz',
      password : '3707c305835899dffda2557587a76227cb9c36d1eccb85d1c4c8188ad7113de2',
      database : 'dfdrek1q68l2gn'
    }
  });

const app = express();

app.use(express.json())    // Substitute for Body parser, which is now included in Express
app.use(cors())

// Basic check of server
app.get('/', (req, res) => {res.send('Success, server is running and responding')})

// SIGNIN
app.post('/signin', (req, res)  => { signin.handleSignin(req, res, db, bcrypt) })

// REGISTER
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// GET PROFILE - not used yet, bet ready for user management
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

// Incrementing entries in DB
app.put('/image', (req, res) => { image.handleImage(req, res, db)})

// API call to Clarifai API
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})