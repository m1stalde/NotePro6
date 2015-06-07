/**
 * Note Class.
 */

var noteModule = (function() {
    "use strict";

    function Note(title, description, importance, duedate, finishdate) {

        this.title = title;
        this.description = description;
        this.importance = importance;
        this.duedate = duedate;
        this.finishdate = finishdate;

        this.id = null;
        this.creationdate = new Date().toDateString();
    }

    /**
     * Returns Note constructor function.
     */
    return {
        Note: Note
    };
})();
