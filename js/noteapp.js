/**
 * Note App Class to interact with note ui.
 */

;(function($, window, document, undefined) {
    "use strict";

    var noteList;
    var createNotesHtml_T;

    $(document).ready(function() {
        init();
    });

    function init() {
        console.log("initializing note app");

        createNotesHtml_T = createNoteListTemplate();

        noteList = new noteListModule.NoteList();
        noteList.setNoteUpdateListener(noteUpdated);

        registerEvents(noteList);

        renderNotes();
    }

    function createNoteListTemplate() {
        console.log("create note list template");

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

        return Handlebars.compile($("#noteListTemplate").html());
    }

    function registerEvents (noteList) {
        console.log("register events");

        $("#btnCreateNote").bind("click", function() {
            noteList.createNote();
        });

        $("#selTheme").bind("change", function(evt) {
            switchStyle(evt.target.value);
        });

        $("#btnSortDueDate").bind("click", function() {
            setNotesSortOrder(noteList, noteList.notesSortOrders.DUE_DATE);
        });
        $("#btnSortFinishDate").bind("click", function() {
            setNotesSortOrder(noteList, noteList.notesSortOrders.FINISH_DATE);
        });
        $("#btnSortCreationDate").bind("click", function() {
            setNotesSortOrder(noteList, noteList.notesSortOrders.CREATION_DATE);
        });
        $("#btnSortImportance").bind("click", function() {
            setNotesSortOrder(noteList, noteList.notesSortOrders.IMPORTANCE);
        });

        $("#btnShowFinished").bind("click", function() {
            toggleShowFinishedNotes();
            $("#btnShowFinished").toggleClass("selected", noteList.showFinishedNotes);
        });

        $("#noteList").on("click", "input.editbutton", function(event) {
            if (event.target.dataset.noteid) {
                noteList.editNote(event.target.dataset.noteid);
            }
        });

        $("#noteList").on("click", "input:checkbox", function(event) {
            if (event.target.dataset.noteid) {
                noteList.toggleFinishdate(event.target.dataset.noteid);
            }
        });
    }

    function switchStyle (cssFileName) {
        var link = document.getElementById("pagestyle");
        link.setAttribute('href', cssFileName);
    }

    function renderNotes() {
        var renderNotes = noteList.getRenderNotes();
        $("#noteList").html(createNotesHtml_T(renderNotes));
    }

    function setNotesSortOrder(noteList, notesSortOrder) {
        console.log("setting notes sort order to " + notesSortOrder);
        noteList.notesSortOrder = notesSortOrder;
        renderNotes();

        $("#btnSortDueDate").toggleClass("selected", noteList.notesSortOrders.DUE_DATE == notesSortOrder);
        $("#btnSortFinishDate").toggleClass("selected", noteList.notesSortOrders.FINISH_DATE == notesSortOrder);
        $("#btnSortCreationDate").toggleClass("selected", noteList.notesSortOrders.CREATION_DATE == notesSortOrder);
        $("#btnSortImportance").toggleClass("selected", noteList.notesSortOrders.IMPORTANCE == notesSortOrder);
    }

    function toggleShowFinishedNotes() {
        var currentValue = noteList.showFinishedNotes;

        if (currentValue) {
            noteList.showFinishedNotes = false;
        } else {
            noteList.showFinishedNotes = true;
        }
        console.log("show finished notes to " + noteList.showFinishedNotes);
        renderNotes();
    }

    function noteUpdated(noteId) {
        console.log("note updated " + noteId);
        renderNotes();
        wiggleNote(noteId);
    }

    function wiggleNote(noteId) {
        console.log("wiggle note " + noteId);
        $("#note-"+noteId).addClass("wiggleNote");
    }

})(jQuery, window, document);
