var store = require("../services/noteStore.js");

// handle notes get request to send json string to client
module.exports.getNotes = function(req, res) {
    store.getNotes(function (err, notes) {
        if (err) {
            res.status(500).end();
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send({notes: notes});
        }
    });
};

// handle note post request to save json string to file
module.exports.saveNote = function(req, res) {

    // check that request contains body with note attribute
    if (!req.body || !req.body.note) {
        return res.sendStatus(400)
    }

    // save notes to file
    var note = JSON.parse(req.body.note);
    store.saveNote(note, function (err) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
};