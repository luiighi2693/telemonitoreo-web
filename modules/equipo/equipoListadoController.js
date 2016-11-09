/**
 * Created by LRodriguez on 09/11/2016.
 */
var idSelectedForDelete;

$( document ).ready(function() {

    if(sessionStorage.getItem("rol")=="Medico" || sessionStorage.getItem("rol")=="Estudiante"){
        document.getElementById("addMedicalEquip").setAttribute("style", "display:none");
        document.getElementById("editRow").setAttribute("style", "display:none");
        document.getElementById("deleteRow").setAttribute("style", "display:none");
    }

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    listTable();
});

function listTable() {
    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            var tabla = document.getElementById("cuerpoTabla");
            tabla.innerHTML = '';

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("tr");

                if(sessionStorage.getItem("rol")!="Medico" && sessionStorage.getItem("rol")!="Estudiante"){
                    var removeRow = document.createElement("td");
                    var removeLink = document.createElement("a");
                    removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
                    removeLink.setAttribute("onclick", "selectForDelete("+object.id+")");
                    removeLink.setAttribute("href", "#modalDelete");
                    var removeIcon = document.createElement("i");
                    removeIcon.setAttribute("class", "material-icons");
                    removeIcon.appendChild(document.createTextNode("remove"));
                    removeLink.appendChild(removeIcon);
                    removeRow.appendChild(removeLink);
                    nodo.appendChild(removeRow);

                    var editRow = document.createElement("td");
                    var editLink = document.createElement("a");
                    editLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light blue");
                    editLink.setAttribute("onclick", "loadModule('equipo','equipo', 'Detalle', "+object.id+")");
                    var editIcon = document.createElement("i");
                    editIcon.setAttribute("class", "material-icons");
                    editIcon.appendChild(document.createTextNode("edit"));
                    editLink.appendChild(editIcon);
                    editRow.appendChild(editLink);
                    nodo.appendChild(editRow);
                }


                var nombre = document.createElement("td");
                nombre.appendChild(document.createTextNode(object.nombre+" "+object.marca+" "+object.modelo));
                nodo.appendChild(nombre);

                var serial = document.createElement("td");
                serial.appendChild(document.createTextNode(object.serial));
                nodo.appendChild(serial);

                var tipoequipo = document.createElement("td");
                tipoequipo.appendChild(document.createTextNode(object.tipoequipo));
                nodo.appendChild(tipoequipo);

                var tipoconexion = document.createElement("td");
                tipoconexion.appendChild(document.createTextNode(object.tipoconexion));
                nodo.appendChild(tipoconexion);

                var ip = document.createElement("td");
                ip.appendChild(document.createTextNode(object.ip));
                nodo.appendChild(ip);

                var moduloconexion = document.createElement("td");
                moduloconexion.appendChild(document.createTextNode(object.moduloconexion));
                nodo.appendChild(moduloconexion);

                tabla.appendChild(nodo);
            }

            $('.modal-trigger').leanModal();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function selectForDelete(id) {
    idSelectedForDelete = id;
    console.log(idSelectedForDelete);
}

function eliminar() {
    document.getElementById("spinner").setAttribute("class", "");
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+idSelectedForDelete,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            console.log(data);
            listTable();
        },
        error: function (error) {
            console.log(error);
        }
    });
}