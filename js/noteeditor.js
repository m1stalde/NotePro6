/**
 * Note Editor Class to interact with note editor ui.
 */

var noteEditorModule = (function() {
    "use strict";

    function NoteEditor(noteList) {
        console.log("initializing note editor");

        this.note = null;
        this.noteList = noteList;
        this.dateFormat = "DD.MM.YYYY";
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

        $("#noteEditorImportance").on("click", "span.bolt", function(event) {
            if (event.target.dataset.importance) {
                noteEditor.setImportance(event.target.dataset.importance);
            }
        });

        $(".datepicker").datepicker();
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
        var currentDate = new Date().toISOString();

        newNote.creationdate = currentDate;
        newNote.duedate = currentDate;
        newNote.importance = 3;

        this.editNote(newNote);
    }

    NoteEditor.prototype.editNote = function editNote(note) {
        this.note = note;

        // select first jQuery element found
        var editorForm = $("#noteEditorForm")[0];

        editorForm.elements["title"].value = note.title ? note.title : "";
        editorForm.elements["description"].value = note.description ? note.description : "";
        editorForm.elements["duedate"].value = note.duedate ? moment(note.duedate).format(this.dateFormat) : "";

        // check importance radio button
        var importance = note.importance ? note.importance : 3;
        $("#noteEditorForm #noteEditorImportance input[value="+importance+"]").prop('checked', true);

        this.showEditor();
    }

    NoteEditor.prototype.saveNote = function saveNote() {
        // select first jQuery element found
        var editorForm = $("#noteEditorForm")[0];

        this.note.title = editorForm.elements["title"].value;
        this.note.description = editorForm.elements["description"].value;
        this.note.duedate = moment(editorForm.elements["duedate"].value, this.dateFormat).format("YYYY-MM-DD");

        // get checked importance radio button value
        var importance = $("#noteEditorForm #noteEditorImportance input:checked").val();
        this.note.importance = importance;

        this.noteList.addNote(this.note);
        this.hideEditor();
        this.note = null;
    }

    NoteEditor.prototype.setImportance = function setImportance(importance) {
        console.log("set importance " + importance);
        this.note.importance = importance;
    }

    /**
     * Returns NoteEditor constructor function.
     */
    return {
        NoteEditor: NoteEditor
    };
})();
