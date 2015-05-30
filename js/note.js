/**
 * Created by Marcel on 30.05.2015.
 */

function Note(title, description, rating, duedate, finishdate) {

    this.title = title;
    this.description = description;
    this.rating = rating;
    this.duedate = duedate;
    this.finishdate = finishdate;

}

Note.prototype = {
    id: null,
    title: "",
    description: "",
    rating: 0,
    duedate: null,
    finishdate: null
}
