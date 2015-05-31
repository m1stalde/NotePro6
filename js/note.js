/**
 * Created by Marcel on 30.05.2015.
 */

function Note(title, description, importance, duedate, finishdate) {

    this.title = title;
    this.description = description;
    this.importance = importance;
    this.duedate = duedate;
    this.finishdate = finishdate;
}

Note.prototype = {
    id: null,
    title: "",
    description: "",
    importance: 3,
    duedate: null,
    finishdate: null,
    creationdate: new Date().toDateString()
}
