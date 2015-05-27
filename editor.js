
var noteList = new Array();

window.onload = function(){
    document.getElementById("btnCreateNote").addEventListener("click", function(){
        showEditor();
    });
    document.getElementById("btnCloseEditor").addEventListener("click", function(){
        hideEditor();
    });
    document.getElementById("btnSaveNote").addEventListener("click", function(){
        saveNote();
    });
    document.getElementById("btnCancelNote").addEventListener("click", function(){
        hideEditor();
    });

    document.getElementById("selTheme").addEventListener("change", function(evt){
        switchStyle(evt.target.value);
    });

    var noteListNode = document.getElementById("noteList");
    var noteTemplateNode = document.getElementById("noteTemplate");
    appendNote(noteListNode, noteTemplateNode, new Note("CAS FEE Selbststudium / Projekt Aufgabe erledigen", "HTML für die note App erstellen.\nCSS erstellen für die Note App.", "2015-02-01", "2015-05-27"));
    appendNote(noteListNode, noteTemplateNode, new Note("Titel", "Beschreibung", "2015-02-01", "2015-05-27"));
}

function hideEditor() {
    document.getElementById("noteEditor").style.visibility = "hidden";
}

function showEditor() {
    document.getElementById("noteEditor").style.visibility = "visible";
}

function editNote(id) {
    showEditor();
}

function saveNote() {
    var form = document.getElementById("noteEditorForm");

    var note = new Note();
    note.title = form.elements["title"].value;
    note.duedate = form.elements["duedate"].value;
    note.description = form.elements["description"].value

    addNote(note);
    hideEditor();
}

function switchStyle (cssFileName) {
    var link = document.getElementById("pagestyle");
    link.setAttribute('href', cssFileName);

    /* var linkTags = document.getElementsByTagName("link");
    for (var i = 0; i < linkTags.length ; i++ ) {
        var linkTag = linkTags[i];
        if ((linkTag.rel.indexOf( "stylesheet" ) != -1) &&
            linkTag.title) {
            if (linkTag.title === cssTitle) {
                linkTag.disabled = false ;
            } else {
                linkTag.disabled = true ;
            }
        }
    } */
}


function Note(title, description, duedate, finishdate) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.finishdate = finishdate;

    if (this.duedate) {
        this.duedate = new Date(this.duedate).toLocaleDateString();
    }

    this.finishdateFormat = "";
    this.finished = false;
    if (this.finishdate) {
        this.finishdateFormat = new Date(this.finishdate).toLocaleDateString();
        this.finished = true;
    }
}

function addNote(note) {
    this.noteList.push(note);
    var noteListNode = document.getElementById("noteList");
    var noteTemplateNode = document.getElementById("noteTemplate");
    appendNote(noteListNode, noteTemplateNode, note);
}

function appendNote(noteListNode, noteTemplateNode, note) {
    var node = noteTemplateNode.cloneNode(true);
    var dataBindElements = node.querySelectorAll("[data-bind]");
    for (var i = 0; i < dataBindElements.length ; i++ ) {
        var attrName = dataBindElements[i].getAttribute("data-bind");
        if (note[attrName] !== undefined) {
            dataBindElements[i].innerHTML = note[attrName];
        }
    }
    noteListNode.appendChild(node);
}