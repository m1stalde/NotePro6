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

    $("#btnSortDueDate").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.NSO_DUE_DATE);
    });
    $("#btnSortFinishDate").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.NSO_FINISH_DATE);
    });
    $("#btnSortCreationDate").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.NSO_CREATION_DATE);
    });
    $("#btnSortImportance").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.NSO_IMPORTANCE);
    });

    $("#btnShowFinished").bind("click", function() {
        noteApp.toggleShowFinishedNotes(noteApp.showFinishedNotes);
        $("#btnShowFinished").toggleClass("selected", noteApp.showFinishedNotes);
    });

    this.noteEditor = new NoteEditor(this) ; // init note editor

    this.loadNotes();
    this.renderNotes();
}

NoteApp.prototype = {
    storageKey: "notes",
    notes: new Array(),
    createNotesHtml_T: undefined,
    noteEditor: undefined,

    NSO_DUE_DATE: "DUE_DATE",
    NSO_FINISH_DATE: "FINISH_DATE",
    NSO_CREATION_DATE: "CREATION_DATE",
    NSO_IMPORTANCE: "IMPORTANCE",
    notesSortOrder: this.NSO_DUE_DATE,

    showFinishedNotes: false
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

/*NoteApp.prototype.getNote = function getNote(noteId) {
    this.showEditor();
}*/

NoteApp.prototype.renderNotes = function renderNotes() {
    var compareNotesFunc = this.compareNotes.bind(this);
    var filteredNotes = this.filterNotes(this.notes);
    filteredNotes.sort(compareNotesFunc);
    $("#noteList").html(this.createNotesHtml_T(filteredNotes));
}

NoteApp.prototype.loadNotes = function loadNotes() {
    var notesJSON = localStorage.getItem(this.storageKey)

    if (notesJSON) {
        var storageNotes = JSON.parse(notesJSON);
        this.notes.push.apply(this.notes, storageNotes); // add storage notes to notes array
    }

    if (!this.notes || this.notes.length == 0) {
        this.addNote(new Note("CAS FEE Selbststudium / Projekt Aufgabe erledigen", "HTML für die note App erstellen.\nCSS erstellen für die Note App.", 5, "2015-02-01", "2015-05-27"));
        this.addNote(new Note("Titel", "Beschreibung", 3, "2015-03-02", "2015-02-23"));
    }
}

NoteApp.prototype.saveNotes = function saveNotes() {
    var notesJSON = JSON.stringify(this.notes);
    localStorage.setItem(this.storageKey, notesJSON);
}

NoteApp.prototype.setNotesSortOrder = function setNotesSortOrder(notesSortOrder) {
    console.log("setting notes sort order to " + notesSortOrder);
    this.notesSortOrder = notesSortOrder;
    this.renderNotes();

    $("#btnSortDueDate").toggleClass("selected", this.NSO_DUE_DATE == notesSortOrder);
    $("#btnSortFinishDate").toggleClass("selected", this.NSO_FINISH_DATE == notesSortOrder);
    $("#btnSortCreationDate").toggleClass("selected", this.NSO_CREATION_DATE == notesSortOrder);
    $("#btnSortImportance").toggleClass("selected", this.NSO_IMPORTANCE == notesSortOrder);
}

NoteApp.prototype.compareNotes = function compareNotes(note1, note2) {
    switch (this.notesSortOrder) {
        case this.NSO_DUE_DATE:
            return new Date(note1.duedate) - new Date(note2.duedate);
        case this.NSO_FINISH_DATE:
            return new Date(note1.finishdate) - new Date(note2.finishdate);
        case this.NSO_CREATION_DATE:
            return new Date(note1.creationdate) - new Date(note2.creationdate);
        case this.NSO_IMPORTANCE:
            return note2.importance - note1.importance;
        default:
            note1.id - note2.id;
    }
}

NoteApp.prototype.toggleShowFinishedNotes = function toggleShowFinishedNotes(currentValue) {
    if (currentValue) {
        this.showFinishedNotes = false;
    } else {
        this.showFinishedNotes = true;
    }
    console.log("show finished notes to " + this.showFinishedNotes);
    this.renderNotes();
}

NoteApp.prototype.filterNotes = function filterNotes(notes) {
    if (this.showFinishedNotes) {
        return notes;
    } else {
        return notes.filter(function(e) { return !(e.finishdate) });
    }
}
