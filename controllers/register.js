const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {                     //transaction -> if one part fails, the other is rollbacked.
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
            .then(newUser => {
                res.json(newUser[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
    handleRegister: handleRegister
}