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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use("/notes", require('./routes/noteRoutes.js'));


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
});

wss.broadcast = function broadcast(data) {
    console.log("broadcasting data to all clients " + data);

    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(data));
    });
};

// startup server
var server = app.listen(3000, "localhost", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server listening at http://%s:%s', host, port);

    notes.setNotifyUpdateListener(function (note) {
        var data = { note: note };
        wss.broadcast(data);
    })
});
