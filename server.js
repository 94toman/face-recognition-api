const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
    bcrypt.hash(password, null, null, function(err, hash) {
        hashPassword = hash;
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

// GET PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            return res.json(user)
        } 
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries)
        } 
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})


/*
// Load hash from your password DB.


*/

app.listen(3000, () => {
    console.log('app is running on port 3000');
})