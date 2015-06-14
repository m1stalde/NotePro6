/**
 * Module to load and save notes json to/from file.
 *
 * @type {exports|module.exports}
 */

// register module
var fs = require("fs");

// define defaults
var filename = "notes.txt";

/**
 * Loads notes from file
 *
 * @param callback
 */
function publicLoadNotes(callback) {
    console.log("reading notes from file " + filename);

    fs.exists(filename, function (exists) {
        if (exists) {
            fs.readFile(filename, function (err, data) {
                if (err) throw err;
                if (callback) callback(data.toString());
            });
        } else {
            if (callback) callback("[]");
        }
    });

}

/**
 * Saves notes to file.
 *
 * @param notesString
 * @param callback
 */
function publicSaveNotes(notesString, callback) {
    console.log("saving notes to file " + filename);

    fs.writeFile(filename, notesString, function (err) {
        if (err) throw err;
        if (callback) callback();
    });
}

// export public functions
module.exports = {loadNotes : publicLoadNotes, saveNotes: publicSaveNotes};