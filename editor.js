window.onload = function(){
    document.getElementById("btnCreateNote").addEventListener("click", function(){
        showEditor();
    });
    document.getElementById("btnCloseEditor").addEventListener("click", function(){
        hideEditor()
    });
    document.getElementById("btnSaveNote").addEventListener("click", function(){
        hideEditor()
    });
    document.getElementById("btnCancelNote").addEventListener("click", function(){
        hideEditor()
    });
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
