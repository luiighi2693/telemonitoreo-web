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