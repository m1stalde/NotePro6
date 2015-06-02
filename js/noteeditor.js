/**
 * Created by Marcel on 30.05.2015.
 */


function NoteEditor(noteApp) {
    console.log("initializing note editor");

    this.noteApp = noteApp;
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

NoteEditor.prototype = {
    note: null,
    noteApp: null
}

NoteEditor.prototype.hideEditor = function hideEditor() {
    $("#noteEditor")[0].style.visibility = "hidden"; // TODO: warum ist [0] nötig?
}

NoteEditor.prototype.showEditor = function showEditor() {
    $("#noteEditor")[0].style.visibility = "visible"; // TODO: warum ist [0] nötig?
}

NoteEditor.prototype.createNote = function createNote() {
    this.editNote(new Note());
}

NoteEditor.prototype.editNote = function editNote(note) {
    this.note = note;

    var editorForm = $("#noteEditorForm")[0];  // TODO: warum ist [0] nötig?

    editorForm.elements["title"].value = note.title ? note.title : "";
    editorForm.elements["description"].value = note.description ? note.description : "";
    //editorForm.elements["importance"].value = note.rating; // TODO implement rating
    editorForm.elements["duedate"].value = note.duedate ? moment(note.duedate).format("DD.MM.YYYY") : "";

    this.showEditor();
}

NoteEditor.prototype.saveNote = function saveNote() {
    var editorForm = $("#noteEditorForm")[0];  // TODO: warum ist [0] nö

    this.note.title = editorForm.elements["title"].value;
    this.note.description = editorForm.elements["description"].value;
    //this.importance = editorForm.elements["importance"].value; // TODO implement rating
    this.note.importance = 3;
    this.note.duedate = editorForm.elements["duedate"].value;

    this.noteApp.addNote(this.note);
    this.hideEditor();
    this.note = null;
}
