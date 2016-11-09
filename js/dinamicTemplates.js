/**
 * Created by LRodriguez on 09/11/2016.
 */
function setTable(id,ids, names, nameBodyTable) {
    var tableFormDiv = document.getElementById(id);

    var tableForm = document.createElement("table");
    tableForm.setAttribute("class","striped centered");

    var theadForm = document.createElement("thead");

    var trForm = document.createElement("tr");

    var thFormDelete = document.createElement("th");
    thFormDelete.setAttribute("id", "deleteRow");
    thFormDelete.setAttribute("data-field","delete");

    var thFormEdit = document.createElement("th");
    thFormEdit.setAttribute("id", "editRow");
    thFormEdit.setAttribute("data-field","edit");

    trForm.appendChild(thFormDelete);
    trForm.appendChild(thFormEdit);

    var thForm = null;
    for(var i=0; i<ids.length; i++){
        thForm = document.createElement("th");
        thForm.setAttribute("data-field",ids[i]);
        thForm.appendChild(document.createTextNode(names[i]));
        trForm.appendChild(thForm);
    }

    theadForm.appendChild(trForm);
    tableForm.appendChild(theadForm);

    var tbodyFrom = document.createElement("tbody");
    tbodyFrom.setAttribute("id", nameBodyTable);
    tableForm.appendChild(tbodyFrom);

    tableFormDiv.appendChild(tableForm);
}

function getRemoveButton(id) {
    var removeRow = document.createElement("td");
    var removeLink = document.createElement("a");
    removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
    removeLink.setAttribute("onclick", "selectForDelete("+id+")");
    removeLink.setAttribute("href", "#modalDelete");
    var removeIcon = document.createElement("i");
    removeIcon.setAttribute("class", "material-icons");
    removeIcon.appendChild(document.createTextNode("remove"));
    removeLink.appendChild(removeIcon);
    removeRow.appendChild(removeLink);
    return removeRow;
}

function getEditButton(module, id) {
    var editRow = document.createElement("td");
    var editLink = document.createElement("a");
    editLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light blue");
    editLink.setAttribute("onclick", "loadModule('"+module+"','"+module+"', 'Detalle', "+id+")");
    var editIcon = document.createElement("i");
    editIcon.setAttribute("class", "material-icons");
    editIcon.appendChild(document.createTextNode("edit"));
    editLink.appendChild(editIcon);
    editRow.appendChild(editLink);
    return editRow;
}