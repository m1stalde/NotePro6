/**
 * Note Editor Class to interact with note editor ui.
 */

var noteEditorModule = (function() {
    "use strict";

    function NoteEditor(noteList) {
        console.log("initializing note editor");

        this.note = null;
        this.noteList = noteList;
        var noteEditor = this;

        $("#btnCloseEditor").bind("click", function() {
            noteEditor.hideEditor();
        });

        $("#btnSaveNote").bind("click", function() {
            noteEditor.saveNote();
        });

        $("#btnCancelNote").bind("click", function() {
            noteEditor.hideEditor();
        });
    }

    NoteEditor.prototype.hideEditor = function hideEditor() {
        $("#noteEditor").css("visibility", "hidden");
    }

    NoteEditor.prototype.showEditor = function showEditor() {
        $("#noteEditor").css("visibility", "visible");
    }

    /**
     * Opens note editor with default values.
     */
    NoteEditor.prototype.createNote = function createNote() {
        var newNote = new noteModule.Note();

        newNote.duedate = new Date().toDateString();
        newNote.importance = 3;

        this.editNote(newNote);
    }

    NoteEditor.prototype.editNote = function editNote(note) {
        this.note = note;

        // select first jQuery element found
        var editorForm = $("#noteEditorForm")[0];

        editorForm.elements["title"].value = note.title ? note.title : "";
        editorForm.elements["description"].value = note.description ? note.description : "";
        //editorForm.elements["importance"].value = note.rating; // TODO implement rating
        editorForm.elements["duedate"].value = note.duedate ? moment(note.duedate).format("DD.MM.YYYY") : "";

        this.showEditor();
    }

    NoteEditor.prototype.saveNote = function saveNote() {
        // select first jQuery element found
        var editorForm = $("#noteEditorForm")[0];

        this.note.title = editorForm.elements["title"].value;
        this.note.description = editorForm.elements["description"].value;
        //this.importance = editorForm.elements["importance"].value; // TODO implement rating
        this.note.importance = 3;
        this.note.duedate = moment(editorForm.elements["duedate"].value, "DD.MM.YYYY");

        this.noteList.addNote(this.note);
        this.hideEditor();
        this.note = null;
    }

    /**
     * Returns NoteEditor constructor function.
     */
    return {
        NoteEditor: NoteEditor
    };
})();
