const express = require('express');
const router = express.Router();
const db = require("../../models");

router.get('/', (req, res) => res.json({ message: 'profile test success' }));
module.exports = router;
