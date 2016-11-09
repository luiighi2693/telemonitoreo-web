/**
 * Created by LRodriguez on 09/11/2016.
 */
var idSelectedForDelete;

$( document ).ready(function() {

    if(sessionStorage.getItem("rol")=="Administrador" || sessionStorage.getItem("rol")=="Estudiante"){
        document.getElementById("addVariable").setAttribute("style", "display:none");
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
        url: "/telemonitoreo-core/web/app_dev.php/variableclinica",
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

                if(sessionStorage.getItem("rol")!="Administrador" && sessionStorage.getItem("rol")!="Estudiante"){
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
                    editLink.setAttribute("onclick", "loadModule('variable','variable', 'Detalle', "+object.id+")");
                    var editIcon = document.createElement("i");
                    editIcon.setAttribute("class", "material-icons");
                    editIcon.appendChild(document.createTextNode("edit"));
                    editLink.appendChild(editIcon);
                    editRow.appendChild(editLink);
                    nodo.appendChild(editRow);

                }

                var nombre = document.createElement("td");
                nombre.appendChild(document.createTextNode(object.nombre));
                nodo.appendChild(nombre);

                var pacientes = document.createElement("td");
                var linkPacientes = document.createElement("a");
                linkPacientes.setAttribute("class", "modal-trigger");
                linkPacientes.setAttribute("href", "#modal1");
                linkPacientes.setAttribute("onclick", "listarPacientesAsociados("+object.id+")");
                linkPacientes.appendChild(document.createTextNode("Pacientes"));
                pacientes.appendChild(linkPacientes);
                nodo.appendChild(pacientes);

                var rango = document.createElement("td");
                rango.appendChild(document.createTextNode(object.rango));
                nodo.appendChild(rango);

                var rango_particular = document.createElement("td");
                if(object.rango_particular!=undefined){
                    rango_particular.appendChild(document.createTextNode(object.rango_particular));
                }
                nodo.appendChild(rango_particular);

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
        url: "/telemonitoreo-core/web/app_dev.php/variableclinica/"+idSelectedForDelete,
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

function listarPacientesAsociados(idVariableClinica) {
    document.getElementById("spinner").setAttribute("class", "");
    var paciente = document.getElementById("pacientesAsociados");
    paciente.innerHTML = '';
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variablehaspaciente",
        type: 'GET',
        dataType: 'json',
        headers: {
            'idvariableclinica': idVariableClinica
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if(data.length==0){
                document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            }

            for (var i=0; i<data.length; i++){
                getPaciente(data[i].id_historia_clinica);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPaciente(idPaciente) {
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/historiaclinica/"+idPaciente,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            console.log(data);
            var paciente = document.getElementById("pacientesAsociados");
            var pacienteLi = document.createElement("li");
            pacienteLi.setAttribute("class", "collection-item");
            pacienteLi.appendChild(document.createTextNode(data.nombre_paciente +" CI:"+data.cedula_paciente));
            paciente.appendChild(pacienteLi);
        },
        error: function (error) {
            console.log(error);
        }
    });
}