/**
 * Created by LRodriguez on 09/11/2016.
 */
$(document).ready(function() {
    $('#submitFormButtons').load('submitFormButton.html');

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    $('select').material_select();
    document.getElementById("spinner").setAttribute("class", "");
    $('.modal-trigger').leanModal();

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/historiaclinica",
        type: 'GET',
        dataType: 'json',
        headers: {
            'usuario': sessionStorage.getItem("usuario")
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            var tabla = document.getElementById("cuerpoTabla");
            tabla.innerHTML = '';

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("tr");

                var paciente = document.createElement("td");
                var inputPaciente = document.createElement("input");
                inputPaciente.setAttribute("type", "checkbox");
                inputPaciente.setAttribute("id", object.id);

                var labelPaciente = document.createElement("label");
                labelPaciente.setAttribute("for", object.id);
                labelPaciente.appendChild(document.createTextNode(object.nombre_paciente));

                paciente.appendChild(inputPaciente);
                paciente.appendChild(labelPaciente);

                nodo.appendChild(paciente);

                var rangoParticular = document.createElement("td");
                var inputRangoParticular = document.createElement("input");
                inputRangoParticular.setAttribute("placeholder", "rangoParticular");
                inputRangoParticular.setAttribute("type", "text");
                rangoParticular.appendChild(inputRangoParticular);
                nodo.appendChild(rangoParticular);

                tabla.appendChild(nodo);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            var equipos = document.getElementById("equipos");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.id);
                nodo.appendChild(document.createTextNode(object.nombre +" "+object.marca +" "+object.modelo +" "+ object.serial));
                equipos.appendChild(nodo);
            }

            var $selectDropdown = $("#equipos");
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
            'rango': rango.value
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");

            for(j=0; j<document.getElementById("cuerpoTabla").childNodes.length;j++){
                if(document.getElementById("cuerpoTabla").childNodes[j].childNodes[0].childNodes[0].checked){
                    setVariableToPatient(data.id, document.getElementById("cuerpoTabla").childNodes[j].childNodes[0].childNodes[0].id, document.getElementById("cuerpoTabla").childNodes[j].childNodes[1].childNodes[0].value);
                }
            }

            var $selectDropdown2 = $("#equipos");
            var equipos = $selectDropdown2.val();
            for (var j=0; j<equipos.length; j++){
                setVariableToEquip(data.id, equipos[j]);
            }
            loadModule('variable','variable', 'Listado', null);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setVariableToPatient(idVariableClinica, idHistoriaClinica, rangoParticular) {
    var uri = "/telemonitoreo-core/web/app_dev.php/variablehaspaciente/";
    var headers = {
        'idhistoriaclinica': idHistoriaClinica,
        'idvariableclinica': idVariableClinica,
        'rangoParticular' : rangoParticular
    };
    var urlRollBack = 'variable';

    save(uri, headers,urlRollBack, 'POST');
}

function setVariableToEquip(idVariableClinica, idEquipoMedico) {
    var uri = "/telemonitoreo-core/web/app_dev.php/variablehasequipo/";
    var headers = {
        'idequipomedico': idEquipoMedico,
        'idvariableclinica': idVariableClinica
    };
    var urlRollBack = 'variable';

    save(uri, headers,urlRollBack, 'POST');
}