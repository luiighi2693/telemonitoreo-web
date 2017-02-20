/**
 * Created by luisc on 8/11/2016.
 */
var idVinculoSelectedForDelete;
var idRegistroSelectedForDelete;
var contDisplaySpinner = 0;

$(document).ready(function() {

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    $('.modal-trigger').leanModal();

    $('select').material_select();
    id = idDetail;

    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/historiaclinica/"+id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            document.getElementById("name").value = data.nombre_paciente;
            document.getElementById("cedula").value = data.cedula_paciente;
            document.getElementById("hcNumber").value = data.codigo;
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico",
        type: 'GET',
        dataType: 'json',
        headers: {
            'idhistoriaclinica': id
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();

            var tablaEquipos = document.getElementById("cuerpoTablaEquipos");
            tablaEquipos.innerHTML = '';

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("tr");

                var nombre = document.createElement("td");
                nombre.appendChild(document.createTextNode(object.nombre+" "+object.marca+" "+object.modelo+" "+object.serial));
                nodo.appendChild(nombre);

                var tipoequipo = document.createElement("td");
                tipoequipo.appendChild(document.createTextNode(object.tipoequipo));
                nodo.appendChild(tipoequipo);

                var ip = document.createElement("td");
                ip.appendChild(document.createTextNode(object.ip));
                nodo.appendChild(ip);

                var tipoconexion = document.createElement("td");
                tipoconexion.appendChild(document.createTextNode(object.tipoconexion));
                nodo.appendChild(tipoconexion);

                var removeRow = document.createElement("td");
                var removeLink = document.createElement("a");
                removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
                removeLink.setAttribute("onclick", "selectVinculoForDelete("+object.id+")");
                var removeIcon = document.createElement("i");
                removeLink.setAttribute("href", "#modalVinculoDelete");
                removeIcon.setAttribute("class", "material-icons");
                removeIcon.appendChild(document.createTextNode("remove"));
                removeLink.appendChild(removeIcon);
                removeRow.appendChild(removeLink);
                nodo.appendChild(removeRow);

                var editRow = document.createElement("td");
                if(object.tipoconexion=="SINCRONA"){
                    var editLink = document.createElement("a");
                    editLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light blue");
//                    editLink.setAttribute("href", "equipoDetalle.html?id="+object.id);
                    var editIcon = document.createElement("i");
                    editIcon.setAttribute("class", "material-icons");
                    editIcon.appendChild(document.createTextNode("settings_remote"));
                    editLink.appendChild(editIcon);
                    editRow.appendChild(editLink);
                }
                nodo.appendChild(editRow);

                tablaEquipos.appendChild(nodo);
            }
            $('.modal-trigger').leanModal();
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico",
        type: 'GET',
        dataType: 'json',
        headers: {
            'idhistoriaclinica': 'all'
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();

            var equiposDisponibles = document.getElementById("type");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.id);
                nodo.appendChild(document.createTextNode(object.nombre+" "+object.marca+" "+object.modelo+" "+object.serial));
                equiposDisponibles.appendChild(nodo);

                var $selectDropdown = $("#type");
                $selectDropdown.trigger('contentChanged');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/registro",
        type: 'GET',
        dataType: 'json',
        headers: {
            'idhistoriaclinica': id
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();

            var cuerpoTablaRegistros = document.getElementById("cuerpoTablaRegistros");
            cuerpoTablaRegistros.innerHTML = '';

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("tr");

                getNombreEquipo(object, nodo, cuerpoTablaRegistros);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});

$('select').on('contentChanged', function() {
    $(this).material_select();
});

function aceptarModal() {
    if(document.getElementById("type").value!=""){
        document.getElementById("spinnerEquipos").setAttribute("class", "");
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+document.getElementById("type").value,
            type: 'PUT',
            dataType: 'json',
            headers: {
                'idhistoriaclinica': id,
                'usuario': sessionStorage.getItem("usuario"),
                'fecha': getFecha()
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinnerEquipos").setAttribute("class", "spinnerHidden");
                loadModule('paciente','paciente', 'Detalle', id);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function selectVinculoForDelete(id) {
    idVinculoSelectedForDelete = id;
    console.log(idVinculoSelectedForDelete);
}

function eliminarVinculo() {
    document.getElementById("spinnerEquipos").setAttribute("class", "");
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+idVinculoSelectedForDelete,
        type: 'PUT',
        dataType: 'json',
        headers: {
            'idhistoriaclinica': "null",
            'usuario': sessionStorage.getItem("usuario"),
            'fecha': getFecha()
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinnerEquipos").setAttribute("class", "spinnerHidden");
            loadModule('paciente','paciente', 'Detalle', id);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getNombreEquipo(object, nodo, cuerpoTablaRegistros) {
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+object.id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var nombre = document.createElement("td");
            nombre.appendChild(document.createTextNode(data.nombre+" "+data.marca+" "+data.modelo+" "+data.serial));
            nodo.appendChild(nombre);

            var fecha = document.createElement("td");
            fecha.appendChild(document.createTextNode(object.fecha));
            nodo.appendChild(fecha);

            var tipoarchivo = document.createElement("td");
            tipoarchivo.appendChild(document.createTextNode(object.tipoarchivo));
            nodo.appendChild(tipoarchivo);

            var moduloVisualizacion = document.createElement("td");
            moduloVisualizacion.appendChild(document.createTextNode(object.modulovisualizacion));
            nodo.appendChild(moduloVisualizacion);

            var statusRow = document.createElement("td");
            var statusLink = document.createElement("a");
            statusLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light green");
            var statusIcon = document.createElement("i");
            statusIcon.setAttribute("class", "material-icons");
            statusIcon.appendChild(document.createTextNode("done"));
            statusLink.appendChild(statusIcon);
            statusRow.appendChild(statusLink);
            nodo.appendChild(statusRow);

            var removeRow = document.createElement("td");
            var removeLink = document.createElement("a");
            removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
            removeLink.setAttribute("onclick", "selectForDeleteRegistro("+object.id+")");
            removeLink.setAttribute("href", "#modalRegistroDelete");
            var removeIcon = document.createElement("i");
            removeIcon.setAttribute("class", "material-icons");
            removeIcon.appendChild(document.createTextNode("remove"));
            removeLink.appendChild(removeIcon);
            removeRow.appendChild(removeLink);
            nodo.appendChild(removeRow);

            var editRow = document.createElement("td");
            var editLink = document.createElement("a");
            editLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light blue");
            var editIcon = document.createElement("i");
            editIcon.setAttribute("class", "material-icons");
            editIcon.appendChild(document.createTextNode("visibility"));
            editLink.appendChild(editIcon);
            editRow.appendChild(editLink);
            nodo.appendChild(editRow);

            cuerpoTablaRegistros.appendChild(nodo);

            $('.modal-trigger').leanModal();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function selectForDeleteRegistro(id) {
    idRegistroSelectedForDelete = id;
    console.log(idRegistroSelectedForDelete);
}

function eliminarRegistro() {
    document.getElementById("spinnerRegistros").setAttribute("class", "");
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/registro/"+idRegistroSelectedForDelete,
        type: 'DELETE',
        dataType: 'json',
        headers: {
            'usuario': sessionStorage.getItem("usuario"),
            'fecha': getFecha()
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinnerRegistros").setAttribute("class", "spinnerHidden");
            loadModule('paciente','paciente', 'Detalle', id);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function displaySpinner() {
    contDisplaySpinner++;
    if (contDisplaySpinner==4){
        document.getElementById("spinner").setAttribute("class", "spinnerHidden");
    }
}

function displayHistorical() {
    window.sessionStorage.setItem("cedulaPaciente", document.getElementById("cedula").value);
    loadModule('paciente','paciente', 'Historicos', null);
}