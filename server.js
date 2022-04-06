const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

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

db.select('*').from('users')
    .then(console.log);

const app = express();

app.use(express.json())    // Substitute for Body parser, which is now included in Express
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }

    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

// SIGNIN
app.post('/signin', (req, res) => {
    let hash = '$2a$10$0h9mjR19YgazXGH.P0mRaO06v1USJOuxo3UNoKoXPsKM4ybjOh072'
    bcrypt.compare("apples", hash, function(err, res) {
        console.log('first guess', res)
    });
    bcrypt.compare("veggies", hash, function(err, res) {
        console.log('second guess', res)
    });
    if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('Error logging in');
    }
})

// REGISTER
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    //const hash = bcrypt.hashSync(password)
    //bcrypt.compareSync("bacon", hash);
    db('users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            joined: new Date()
        })
    .then(newUser => {
        res.json(newUser[0]);
    })
    .catch(err => res.status(400).json('Unable to register'))
})

// GET PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        }
        else res.status(400).json('User not found');
    })
    .catch(err => res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('Unable to get entries'))
})


/*
// Load hash from your password DB.


*/

app.listen(3000, () => {
    console.log('app is running on port 3000');
})