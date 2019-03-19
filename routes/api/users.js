const express = require('express');
const router = express.Router();
const { User } = require("../../models");
const bcrypt = require("bcryptjs");
let jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../conf');


router.get('/', (req, res) => res.send('user test successs'));
router.post('/register', (req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email already exist' });
            } else {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    userName: req.body.userName,
                    email: req.body.email,
                    password: req.body.password
                });
                if (req.body.password == '') {
                    return res.status(201).json({ password: 'password required' })
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (eerr, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    res.json(user)
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }

            }
        })
});
router.post('/login', (req, res) => {
    console.log(req.body, '1111111');
    console.log(req, '2222222');

    const { email, password } = req.body;
    User.findOne({ where: { email } })
        .then(user => {
            //Check user
            if (!user) {
                return res.status(404).json({ email: 'User not found' })
            }
            //Chaeck pass
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    //User Matched 
                    const payload = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }
                    jwt.sign(
                        payload,
                        keys.secret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: token
                            })
                        }
                    )
                    // res.json({ success: 'Success' });
                } else {
                    res.status(400).json({ password: 'Password incorrect' })
                }
            })

        })

});


// Create a private route
module.exports = router;
