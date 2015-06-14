/**
 * Startup class for notes server.
 * Uses express module to server static content to client.
 *
 * @type {exports|module.exports}
 */

// register modules
var notes = require("./notes");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// handle notes get request to send json string to client
app.get('/notes', function(req, res){
    notes.loadNotes(function (data) {
        res.set('Content-Type', 'application/json');
        res.status(200).send({notes: data});
    });
});

// handle notes post request to save json string to file
app.post('/notes', urlencodedParser, function(req, res){

    // check that request contains body with notes attribute
    if (!req.body || !req.body.notes) {
        return res.sendStatus(400)
    }

    // save notes to file
    notes.saveNotes(req.body.notes, function () {
        res.status(200).end();
    });
});

// server static content to client
app.use(express.static('../'));

// startup server
var server = app.listen(3000, "localhost", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server listening at http://%s:%s', host, port);
});
