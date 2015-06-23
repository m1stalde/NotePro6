/**
 * Routes to get and save notes.
 *
 * @type {*|exports|module.exports}
 */

var express = require('express');
var router = express.Router();
var orders = require('../controller/noteController.js');

router.get("/", orders.getNotes);
router.post("/", orders.saveNote);

module.exports = router;