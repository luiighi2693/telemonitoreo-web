/**
 * Created by LRodriguez on 09/11/2016.
 */
var idSelectedForDelete;

$( document ).ready(function() {
    var ids = ['name', 'serial', 'type', 'typeConnection', 'ubicacion', 'detectionModule', 'visualizationModule'];
    var names = ['Nombre', 'Serial', 'Tipo Equipo', 'Tipo Conexión', 'Ubicación', 'Módulo de detección de irregularidades', 'Módulo de Visualización'];
    setTable("dinamicTable", ids, names, "cuerpoTabla");
    
    $('#modalDelete').load('modalDelete.html');

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

                var ubicacion = document.createElement("td");
                ubicacion.appendChild(document.createTextNode(object.ubicacion));
                nodo.appendChild(ubicacion);

                var moduloDeteccionIrregularidades = document.createElement("td");
                moduloDeteccionIrregularidades.appendChild(document.createTextNode(object.modulo_deteccion_irregularidades));
                nodo.appendChild(moduloDeteccionIrregularidades);

                var moduloVisualizacion = document.createElement("td");
                moduloVisualizacion.appendChild(document.createTextNode(object.modulovisualizacion));
                nodo.appendChild(moduloVisualizacion);

                if(sessionStorage.getItem("rol")!="Medico" && sessionStorage.getItem("rol")!="Estudiante"){
                    var removeRow = getRemoveButton(object.id);
                    nodo.appendChild(removeRow);

                    var editRow = getEditButton("equipo", object.id);
                    nodo.appendChild(editRow);
                }

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