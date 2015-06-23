/**
 * Note Events.
 */

var noteEventModule = (function() {
    "use strict";

    function publicConnect(url, onmessage) {
        var connection = new WebSocket(url, ['soap', 'xmpp']);

        // When the connection is open, send some data to the server
        connection.onopen = function () {
            connection.send('Ping'); // Send the message 'Ping' to the server
        };

        // Log errors
        connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        // Log messages from the server
        connection.onmessage = function (e) {
            if (e && e.data) {
                var d = JSON.parse(e.data);
                if (d.note) {
                    if (onmessage) onmessage(d.note);
                } else if (d.message) {
                    console.log('Server: ' + d.message);
                }
            }
        };
    }

    /**
     * Returns Note constructor function.
     */
    return {
        connect: publicConnect
    };
})();
