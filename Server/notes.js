/**
 * Module to load and save notes json to/from file.
 *
 * @type {exports|module.exports}
 */

// register module
var fs = require("fs");

// define defaults
var filename = "notes.txt";

var notifyNoteUpdateListener = null;

function publicSetNotifyUpdateListener(listener) {
    notifyNoteUpdateListener = listener;
}

/**
 * Gets persisted notes.
 *
 * @param callback
 */
function publicGetNotes(callback) {
    privateLoadNotes(function (err, notes) {
        if (callback) callback(err, notes);
    });
}


/**
 * Saves notes to file.
 *
 * @param noteString
 * @param callback
 */
function publicSaveNote(note, callback) {
    console.log("save note " + note);

    privateLoadNotes(function (err, notes) {
        var updatedNotes = privateUpdateNotes(notes, note);
        privateSaveNotes(updatedNotes, function(err) {
            if (callback) callback(err);

            // notify note update listener
            if (notifyNoteUpdateListener) notifyNoteUpdateListener(note);
        })
    });
}

/**
 * Loads notes from file
 *
 * @param callback
 */
function privateLoadNotes(callback) {
    console.log("reading notes from file " + filename);

    fs.exists(filename, function (exists) {
        if (exists) {
            fs.readFile(filename, {encoding: "utf-8"}, function (err, data) {
                if (err) {
                    if (callback) callback(err);
                } else if (callback) {
                    var notes = JSON.parse(data.toString())
                    callback(err, notes);
                }
            });
        } else {
            if (callback) callback(undefined, new Array());
        }
    });

}

function privateSaveNotes(notes, callback) {
    console.log("saving notes to " + filename);

    var notesString = JSON.stringify(notes, null, "  ");

    fs.writeFile(filename, notesString, {encoding: "utf-8"}, function (err) {
        if (callback) callback(err);
    });
}

function privateUpdateNotes(notes, note) {
    var maxNoteId = 1;

    for (var i = 0; i < notes.length; i++) {
        var n = notes[i];

        // get highest note id for new note
        maxNoteId = Math.max(maxNoteId, n.id);

        // replace updated note on existing note
        if (note && note.id && note.id === n.id) {
            notes[i] = note;
        }
    }

    // set id and add new note
    if (!note.id) {
        note.id = maxNoteId + 1;
        notes.push(note);
    }

    return notes;
}

// export public functions
module.exports = {getNotes : publicGetNotes, saveNote: publicSaveNote, setNotifyUpdateListener: publicSetNotifyUpdateListener};