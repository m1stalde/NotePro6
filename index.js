/**
 * Startup class for notes server.
 * Uses express module to server static content to client.
 *
 * @type {exports|module.exports}
 */

// register modules
var notes = require("./services/noteStore.js");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// handle notes get request to send json string to client
app.get('/notes', function(req, res){
    notes.getNotes(function (err, notes) {
        if (err) {
            res.status(500).end();
        } else {
            res.set('Content-Type', 'application/json');
            //res.status(200).send({notes: data});
            res.status(200).send({notes: notes});
        }
    });
});

// handle note post request to save json string to file
app.post('/notes', urlencodedParser, function(req, res){

    // check that request contains body with note attribute
    if (!req.body || !req.body.note) {
        return res.sendStatus(400)
    }

    // save notes to file
    var note = JSON.parse(req.body.note);
    notes.saveNote(note, function (err) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
});

// server static content to client
app.use(express.static(__dirname + '/public'));


// web sockets server
//var WebSocketServer = require('ws').Server;
//var wss = new WebSocketServer({server: app});

var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({host: "localhost", port: 8080});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send(JSON.stringify({message: "Hello"}));
    //ws.send('something');
    //wss.broadcast("something else");
});

wss.broadcast = function broadcast(data) {
    console.log("broadcasting data to all clients " + data);

    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(data));
    });
};

/*wss.on('connection', function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(process.memoryUsage()), function() { });
    }, 100);
    console.log('started client interval');
    ws.on('close', function() {
        console.log('stopping client interval');
        clearInterval(id);
    });
});*/

// startup server
var server = app.listen(3000, "localhost", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server listening at http://%s:%s', host, port);

    notes.setNotifyUpdateListener(function (note) {
        var data = { note: note };
        //var dataString = JSON.stringify(data);
        wss.broadcast(data);
    })
});
