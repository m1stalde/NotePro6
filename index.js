/**
 * Startup class for notes server.
 * Uses express module to server static content to client.
 *
 * @type {exports|module.exports}
 */

// register modules
var notes = require("./services/noteStore.js");
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

// init express server
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/notes", require('./routes/noteRoutes.js'));
app.use(express.static(__dirname + '/public'));

// init http server
var server = http.createServer(app);

// init web socket server
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ server: server });

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
server.listen(3000, "127.0.0.1", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server listening at http://%s:%s', host, port);

    notes.setNotifyUpdateListener(function (note) {
        var data = { note: note };
        wss.broadcast(data);
    })
});