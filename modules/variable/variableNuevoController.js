/**
 * Created by LRodriguez on 09/11/2016.
 */
$(document).ready(function() {

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    $('select').material_select();
    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/historiaclinica",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            var pacientes = document.getElementById("pacientes");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.id);
                nodo.appendChild(document.createTextNode(object.nombre_paciente+" C.I:"+object.cedula_paciente));
                pacientes.appendChild(nodo);
            }

            var $selectDropdown = $("#pacientes");
            $selectDropdown.trigger('contentChanged');
        },
        error: function (error) {
            console.log(error);
        }
    });
});

$('select').on('contentChanged', function() {
    $(this).material_select();
});

function cancelar() {
    loadModule('variable','variable', 'Listado', null);
}

function aceptar() {
    var nombre = document.getElementById("name");
    var rango = document.getElementById("range");
    var rangoParticular = document.getElementById("particularRange");

    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variableclinica/",
        type: 'POST',
        dataType: 'json',
        headers: {
            'nombre': nombre.value,
            'rango': rango.value,
            'rangoparticular': rangoParticular.value
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            var $selectDropdown = $("#pacientes");
            var pacientes = $selectDropdown.val();
            for (var i=0; i<pacientes.length; i++){
                setVariableToPatient(data.id, pacientes[i]);
            }
            loadModule('variable','variable', 'Listado', null);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setVariableToPatient(idVariableClinica, idHistoriaClinica) {
    var uri = "/telemonitoreo-core/web/app_dev.php/variablehaspaciente/";
    var headers = {
        'idhistoriaclinica': idHistoriaClinica,
        'idvariableclinica': idVariableClinica
    };
    var urlRollBack = 'variable';

    save(uri, headers,urlRollBack, 'POST');
}