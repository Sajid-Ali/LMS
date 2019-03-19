const express = require('express');
const bodyParser = require('body-parser');
// const faker = require("faker");
// const times = require("lodash.times");
// const random = require("lodash.random");
const passport = require("passport");
const db = require("./models");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");


// const apiAuthor = require("./app/api/author");

const app = express();
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(bodyParser.json({ encoded: false }));

app.get('/', (req, res) =>
    res.json({ test: "test passed" })
);

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`App listening on port ${port}!`));