
var noteList = new Array();
var	createNotesHtml_T;

window.onload = function(){
    /*Modernizr.load({
        test: Modernizr.inputtypes.date,
        nope: "js/jquery-ui.custom.js",
        callback: function() {
            $("input[type=date]").datepicker();
        }
    });*/

    Handlebars.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    });

    createNotesHtml_T = Handlebars.compile($("#noteListTemplate").html());

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

    noteList.push(new Note("CAS FEE Selbststudium / Projekt Aufgabe erledigen", "HTML für die note App erstellen.\nCSS erstellen für die Note App.", "2015-02-01", "2015-05-27", 5));
    noteList.push(new Note("Titel", "Beschreibung", "2015-02-01", "2015-05-27", 3));
    renderNotes();
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


function Note(title, description, duedate, finishdate, rating) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.finishdate = finishdate;
    this.rating = rating;

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
    renderNotes();
}

function renderNotes() {
    $("#noteList").html(createNotesHtml_T(noteList));
}