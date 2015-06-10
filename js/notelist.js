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
        this.storageKey = "notes";
        this.notesSortOrder = this.notesSortOrders.DUE_DATE;
        this.showFinishedNotes = false;

        this.noteEditor = new noteEditorModule.NoteEditor(this) ; // init note editor
        this.noteUpdateListener = null;

        this.loadNotes();
    }

    NoteList.prototype.notesSortOrders = {
        DUE_DATE: "DUE_DATE",
        FINISH_DATE: "FINISH_DATE",
        CREATION_DATE: "CREATION_DATE",
        IMPORTANCE: "IMPORTANCE"
    }

    NoteList.prototype.addNote = function addNote(note) {
        console.log("add note " + note);

        var noteId = 1;

        if (!note.id) {
            if (this.notes.length > 0) {
                var maxId = Math.max.apply(Math, this.notes.map(function(note) { return note.id; }))
                noteId = maxId + 1;
            }
            note.id = noteId;
            this.notes.push(note);
        }

        this.saveNotes();

        // notify note update listener
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
            this.saveNotes();
            this.notifyNoteUpdateListener(note.id);
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

    NoteList.prototype.loadNotes = function loadNotes() {
        var notesJSON = localStorage.getItem(this.storageKey)
        console.log("load notes: " + notesJSON);

        if (notesJSON) {
            var storageNotes = JSON.parse(notesJSON);
            this.notes.push.apply(this.notes, storageNotes); // add storage notes to notes array
        }

        if (!this.notes || this.notes.length == 0) {
            this.addNote(new noteModule.Note("CAS FEE Selbststudium / Projekt Aufgabe erledigen", "HTML für die note App erstellen.\nCSS erstellen für die Note App.", 5, "2015-02-01", "2015-05-27"));
            this.addNote(new noteModule.Note("Titel", "Beschreibung", 3, "2015-03-02", "2015-02-23"));
        }
    }

    NoteList.prototype.saveNotes = function saveNotes() {
        var notesJSON = JSON.stringify(this.notes);
        console.log("save notes: " + notesJSON);
        localStorage.setItem(this.storageKey, notesJSON);
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
     * Returns NoteList constructor function.
     */
    return {
        NoteList: NoteList
    };
})();