/**
 * Note App Class to interact with note ui.
 */

;(function($, window, document, undefined) {
    "use strict";

    // note list class from note list module
    var noteList;

    // handlebars template for note list entry
    var createNotesHtml_T;

    /**
     * Called after document loaded to init note app.
     */
    $(document).ready(function() {
        init();
    });

    /**
     * Initializes notes app and loads persisted notes.
     */
    function init() {
        console.log("initializing note app");

        createNotesHtml_T = createNoteListTemplate();

        noteList = new noteListModule.NoteList();
        noteList.setNoteUpdateListener(noteUpdated);
        noteList.setNotePersistenceListener(persistEvent);

        registerEvents(noteList);

        noteList.loadNotes();
    }

    /**
     * Inits handlebars with date formats and helpers, and returns handlebars template.
     *
     * @returns {*}
     */
    function createNoteListTemplate() {
        console.log("create note list template");

        var DateFormats = {
            short: "DD.MM.YYYY"
        };

        // helper to format date using moment
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

        // helper to display importance bolt based on importance rating
        Handlebars.registerHelper('for', function(from, to, incr, block) {
            var accum = '';
            for(var i = from; i < to; i += incr)
                accum += block.fn(i);
            return accum;
        });

        // helper to convert new lines into line breaks
        Handlebars.registerHelper('breaklines', function(text) {
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        });

        return Handlebars.compile($("#noteListTemplate").html());
    }

    /**
     * Registers html events in note app.
     *
     * @param noteList
     */
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

    /**
     * Switches css style to given css file.
     *
     * @param cssFileName
     */
    function switchStyle (cssFileName) {
        var link = document.getElementById("pagestyle");
        link.setAttribute('href', cssFileName);
    }

    /**
     * Gets notes from note list and render notes using handlebars template.
     */
    function renderNotes() {
        var renderNotes = noteList.getRenderNotes();
        $("#noteList").html(createNotesHtml_T(renderNotes));
    }

    /**
     * Sets notes sort order to given sort order and renders note list.
     *
     * @param noteList
     * @param notesSortOrder
     */
    function setNotesSortOrder(noteList, notesSortOrder) {
        console.log("setting notes sort order to " + notesSortOrder);
        noteList.notesSortOrder = notesSortOrder;
        renderNotes();

        $("#btnSortDueDate").toggleClass("selected", noteList.notesSortOrders.DUE_DATE == notesSortOrder);
        $("#btnSortFinishDate").toggleClass("selected", noteList.notesSortOrders.FINISH_DATE == notesSortOrder);
        $("#btnSortCreationDate").toggleClass("selected", noteList.notesSortOrders.CREATION_DATE == notesSortOrder);
        $("#btnSortImportance").toggleClass("selected", noteList.notesSortOrders.IMPORTANCE == notesSortOrder);
    }

    /**
     * Sets or resets show finished notes option and renders note list.
     */
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

    /**
     * Renders note list and wiggles updated note with given id.
     *
     * @param noteId
     */
    function noteUpdated(noteId) {
        console.log("note updated " + noteId);
        renderNotes();
        wiggleNote(noteId);
    }

    /**
     * Wiggles note with given id.
     * @param noteId
     */
    function wiggleNote(noteId) {
        console.log("wiggle note " + noteId);
        $("#note-"+noteId).addClass("wiggleNote");
    }

    /**
     * Called after load or save notes.
     *
     * @param operation "load" or "save"
     * @param success true if load or save successful, false otherwise
     * @param message user message to display
     */
    function persistEvent(operation, success, message) {
        if (!success) {
            alert(message);
        } else if ("load" == operation) {
            renderNotes();
        }
    }

})(jQuery, window, document);
