/**
 * Note List Class to handle array of notes.
 *
 * This class implements the business logic like filtering and sorting of notes.
 * No HTML-DOM or HTML-Event-Handling in this class!
 */

var noteListModule = (function() {
    "use strict";

    function NoteList() {
        console.log("initializing note list");

        this.notes = new Array();
        this.serverUrl = "/notes";
        this.storageKey = "notes";
        this.notesSortOrder = this.notesSortOrders.DUE_DATE;
        this.showFinishedNotes = false;

        this.noteEditor = new noteEditorModule.NoteEditor(this) ; // init note editor
        this.noteUpdateListener = null;
        this.notePersistenceListener = null;

        var noteList = this;
        noteEventModule.connect(function (note) {
            noteList.noteUpdated(note);
        });
    }

    NoteList.prototype.notesSortOrders = {
        DUE_DATE: "DUE_DATE",
        FINISH_DATE: "FINISH_DATE",
        CREATION_DATE: "CREATION_DATE",
        IMPORTANCE: "IMPORTANCE"
    }

    NoteList.prototype.addNote = function addNote(note) {
        console.log("add note " + note);

        var noteList = this;

        var data = {
            note: JSON.stringify(note)
        }

        console.log("save note: " + data.note);

        $.post(this.serverUrl, data)
            .done(function() {
                noteList.notifyNotePersistenceListener("save", true, "Daten erfoglreich gespeichert.");
            })
            .fail(function(err) {
                console.log(err);
                noteList.notifyNotePersistenceListener("save", false, "Fehler beim Speichern der Daten.");
            });
    }

    NoteList.prototype.noteUpdated = function noteUpdated(note) {
        console.log("note updated " + note);
        var existingNote = false;

        for (var i = 0; i < this.notes.length; i++) {
            var n = this.notes[i];

            // replace updated note on existing note
            if (note && note.id && note.id === n.id) {
                this.notes[i] = note;
                existingNote = true;
                break;
            }
        }

        if (!existingNote) {
            this.notes.push(note);
        }

        this.notifyNoteUpdateListener(note.id);
    }

    NoteList.prototype.editNote = function editNote(noteId) {
        var note = this.getNote(noteId);

        if (note) {
            this.noteEditor.editNote(note);
        }
    }

    /**
     * Sets or resets finishdate on given note based on current finishdate value.
     *
     * @param noteId note to set or reset finishdate
     */
    NoteList.prototype.toggleFinishdate = function toggleFinishdate(noteId) {
        var note = this.getNote(noteId);

        if (note) {
            note.finishdate = note.finishdate ? null : new Date();
            this.addNote(note);
        }
    }

    NoteList.prototype.createNote = function createNote() {
        this.noteEditor.createNote();
    }

    /**
     * Gets note by id and returns null if note not found or found multiple times.
     *
     * @param noteId note id to search
     * @returns Note or null
     */
    NoteList.prototype.getNote = function getNote(noteId) {
        var note = null;

        var result = $.grep(this.notes, function(e) { return e.id == noteId; });

        if (result.length === 0) {
            console.log("note with id " + noteId + " not found");
        } else if (result.length > 1) {
            console.log("note with id " + noteId + " found " + result.length + " times");
        } else {
            note = result[0];
        }

        return note;
    }

    /**
     * Loads notes from server and notifies note persistence listener on success or error case.
     */
    NoteList.prototype.loadNotes = function loadNotes() {
        var noteList = this;

        $.get(this.serverUrl)
            .done(function(data) {
                // server request successful, check if result contains notes
                if (data && data.notes) {
                    noteList.notes.push.apply(noteList.notes, data.notes); // add storage notes to notes array
                    noteList.notifyNotePersistenceListener("load", true, "Daten erfolgreich geladen.");
                } else {
                    noteList.notifyNotePersistenceListener("load", true, "Keine Daten vorhanden.");
                }
            })
            .fail(function(e) {
                // server request failed
                console.log(e);
                noteList.notifyNotePersistenceListener("load", false, "Fehler beim Laden der Daten.");
            });

        //var notesJSON = localStorage.getItem(this.storageKey);
    }

    NoteList.prototype.setNotesSortOrder = function setNotesSortOrder(notesSortOrder) {
        console.log("setting notes sort order to " + notesSortOrder);
        this.notesSortOrder = notesSortOrder;
    }

    NoteList.prototype.compareNotes = function compareNotes(note1, note2) {
        switch (this.notesSortOrder) {
            case this.notesSortOrders.DUE_DATE:
                return new Date(note1.duedate) - new Date(note2.duedate);
            case this.notesSortOrders.FINISH_DATE:
                return new Date(note1.finishdate) - new Date(note2.finishdate);
            case this.notesSortOrders.CREATION_DATE:
                return new Date(note1.creationdate) - new Date(note2.creationdate);
            case this.notesSortOrders.IMPORTANCE:
                return note2.importance - note1.importance;
            default:
                note1.id - note2.id;
        }
    }

    NoteList.prototype.filterNotes = function filterNotes(notes) {
        if (this.showFinishedNotes) {
            return notes;
        } else {
            return notes.filter(function(e) { return !(e.finishdate) });
        }
    }

    /**
     * Returns filtered and sorted notes array to render in ui.
     */
    NoteList.prototype.getRenderNotes = function getRenderNotes() {
        var filteredNotes = this.filterNotes(this.notes);

        var noteList = this;
        filteredNotes.sort(function(note1, note2) {
            return noteList.compareNotes(note1, note2)
        });

        return filteredNotes;
    }

    /**
     * Register listener to call with note id on create or update notes.
     *
     * @param listener
     */
    NoteList.prototype.setNoteUpdateListener = function setNoteUpdateListener(listener) {
        this.noteUpdateListener = listener;
    }

    NoteList.prototype.notifyNoteUpdateListener = function notifyNoteUpdateListener(noteId) {
        console.log("notify note update listener for note " + noteId);

        if (this.noteUpdateListener) {
            this.noteUpdateListener(noteId);
        }
    }

    /**
     * Register listener to call with operation, success and message after load or save operation.
     *
     * @param listener
     */
    NoteList.prototype.setNotePersistenceListener = function setNotePersistenceListener(listener) {
        this.notePersistenceListener = listener;
    }

    /**
     * Notifies persistence listener.
     *
     * @param operation load or save
     * @param success true or false
     * @param message success or error message
     */
    NoteList.prototype.notifyNotePersistenceListener = function notifyNotePersistenceListener(operation, success, message) {
        console.log("notify note persistence listener with message " + message);

        if (this.notePersistenceListener) {
            this.notePersistenceListener(operation, success, message);
        }
    }

    /**
     * Returns NoteList constructor function.
     */
    return {
        NoteList: NoteList
    };
})();