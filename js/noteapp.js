/**
 * Created by Marcel on 30.05.2015.
 */

$(document).ready(function() {
    window.noteApp = new NoteApp(); // init note app
});

function NoteApp() {
    console.log("initializing note app");

    this.notesSortOrder = this.notesSortOrders.DUE_DATE;

    var DateFormats = {
        short: "DD.MM.YYYY"
    };

    Handlebars.registerHelper("formatDate", function(datetime, format) {
        if (!datetime) {
            return "";
        }
        else if (moment) {
            format = DateFormats[format] || format;
            return moment(datetime).format(format);
        }
        else {
            return datetime;
        }
    });

    Handlebars.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    });

    this.createNotesHtml_T = Handlebars.compile($("#noteListTemplate").html());

    this.registerEvents();

    this.noteEditor = new NoteEditor(this) ; // init note editor

    this.loadNotes();
    this.renderNotes();
}

NoteApp.prototype = {
    storageKey: "notes",
    notes: new Array(),
    createNotesHtml_T: undefined,
    noteEditor: undefined,

    notesSortOrders: {
        DUE_DATE: "DUE_DATE",
        FINISH_DATE: "FINISH_DATE",
        CREATION_DATE: "CREATION_DATE",
        IMPORTANCE: "IMPORTANCE"
    },
    notesSortOrder: undefined,

    showFinishedNotes: false
}

NoteApp.prototype.registerEvents = function registerEvents () {
    $("#btnCreateNote").bind("click", function() {
        noteApp.createNote();
    });

    $("#selTheme").bind("change", function(evt) {
        noteApp.switchStyle(evt.target.value);
    });

    $("#btnSortDueDate").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.notesSortOrders.DUE_DATE);
    });
    $("#btnSortFinishDate").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.notesSortOrders.FINISH_DATE);
    });
    $("#btnSortCreationDate").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.notesSortOrders.CREATION_DATE);
    });
    $("#btnSortImportance").bind("click", function() {
        noteApp.setNotesSortOrder(noteApp.notesSortOrders.IMPORTANCE);
    });

    $("#btnShowFinished").bind("click", function() {
        noteApp.toggleShowFinishedNotes(noteApp.showFinishedNotes);
        $("#btnShowFinished").toggleClass("selected", noteApp.showFinishedNotes);
    });

    $("#noteList").on("click", "input.editbutton", function(event) {
        if (event.target.dataset.noteid) {
            noteApp.editNote(event.target.dataset.noteid);
        }
    });

    $("#noteList").on("click", "input:checkbox", function(event) {
        if (event.target.dataset.noteid) {
            noteApp.toggleFinishdate(event.target.dataset.noteid);
        }
    });
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
NoteApp.prototype.toggleFinishdate = function toggleFinishdate(noteId) {
    var note = this.getNote(noteId);

    if (note) {
        note.finishdate = note.finishdate ? null : new Date();
        this.saveNotes();
        this.renderNotes();
    }
}

NoteApp.prototype.createNote = function createNote() {
    this.noteEditor.createNote();
}

/**
 * Gets note by id and returns null if note not found or found multiple times.
 *
 * @param noteId note id to search
 * @returns Note or null
 */
NoteApp.prototype.getNote = function getNote(noteId) {
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

NoteApp.prototype.renderNotes = function renderNotes() {
    var compareNotesFunc = this.compareNotes.bind(this);
    var filteredNotes = this.filterNotes(this.notes);
    filteredNotes.sort(compareNotesFunc);
    $("#noteList").html(this.createNotesHtml_T(filteredNotes));
}

NoteApp.prototype.loadNotes = function loadNotes() {
    var notesJSON = localStorage.getItem(this.storageKey)
    console.log("load notes: " + notesJSON);

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
    console.log("save notes: " + notesJSON);
    localStorage.setItem(this.storageKey, notesJSON);
}

NoteApp.prototype.setNotesSortOrder = function setNotesSortOrder(notesSortOrder) {
    console.log("setting notes sort order to " + notesSortOrder);
    this.notesSortOrder = notesSortOrder;
    this.renderNotes();

    $("#btnSortDueDate").toggleClass("selected", this.notesSortOrders.DUE_DATE == notesSortOrder);
    $("#btnSortFinishDate").toggleClass("selected", this.notesSortOrders.FINISH_DATE == notesSortOrder);
    $("#btnSortCreationDate").toggleClass("selected", this.notesSortOrders.CREATION_DATE == notesSortOrder);
    $("#btnSortImportance").toggleClass("selected", this.notesSortOrders.IMPORTANCE == notesSortOrder);
}

NoteApp.prototype.compareNotes = function compareNotes(note1, note2) {
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
