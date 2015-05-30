/**
 * Created by Marcel on 30.05.2015.
 */

$(document).ready(function() {
    window.noteApp = new NoteApp(); // init note app
});

function NoteApp() {
    console.log("initializing note app");

    Handlebars.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    });

    this.createNotesHtml_T = Handlebars.compile($("#noteListTemplate").html());

    $("#btnCreateNote").bind("click", function() {
        noteApp.createNote();
    });

    $("#selTheme").bind("change", function(evt) {
        noteApp.switchStyle(evt.target.value);
    });

    this.noteEditor = new NoteEditor(this) ; // init note editor

    this.loadNotes();
    this.renderNotes();
}

NoteApp.prototype = {
    storageKey: "notes",
    notes: new Array(),
    createNotesHtml_T: undefined,
    noteEditor: undefined
}

NoteApp.prototype.switchStyle = function switchStyle (cssFileName) {
    var link = document.getElementById("pagestyle");
    link.setAttribute('href', cssFileName);
}

NoteApp.prototype.addNote = function addNote(note) {
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
    this.renderNotes();
}

NoteApp.prototype.editNote = function editNote(noteId) {
    var result = $.grep(this.notes, function(e) { return e.id == noteId; });

    if (result.length == 1) {
        this.noteEditor.editNote(result[0]);
    } else {
        console.log("note with id " + noteId + " not found");
    }
}

NoteApp.prototype.createNote = function createNote() {
    this.noteEditor.createNote();
}

NoteApp.prototype.getNote = function getNote(noteId) {
    this.showEditor();
}

NoteApp.prototype.renderNotes = function renderNotes() {
    $("#noteList").html(this.createNotesHtml_T(this.notes));
}

NoteApp.prototype.loadNotes = function loadNotes() {
    var notesJSON = localStorage.getItem(this.storageKey)

    if (notesJSON) {
        var storageNotes = JSON.parse(notesJSON);
        this.notes.push.apply(this.notes, storageNotes); // add storage notes to notes array
    }

    if (!this.notes || this.notes.length == 0) {
        this.notes.push(new Note("CAS FEE Selbststudium / Projekt Aufgabe erledigen", "HTML für die note App erstellen.\nCSS erstellen für die Note App.", 5, "2015-02-01", "2015-05-27"));
        this.notes.push(new Note("Titel", "Beschreibung", 3, "2015-02-01", "2015-05-27"));
    }
}

NoteApp.prototype.saveNotes = function saveNotes() {
    var notesJSON = JSON.stringify(this.notes);
    localStorage.setItem(this.storageKey, notesJSON);
}

