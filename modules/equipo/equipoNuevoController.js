/**
 * Created by LRodriguez on 09/11/2016.
 */
var contDisplaySpinner = 0;

$(document).ready(function() {
    $('#submitFormButtons').load('submitFormButton.html');

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    $('select').material_select();
    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro",
        type: 'GET',
        dataType: 'json',
        headers: {
            'codigo': 'Equipo_Medico'
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            var tipoEquipo = document.getElementById("type");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.valor);
                nodo.appendChild(document.createTextNode(object.nombre));
                tipoEquipo.appendChild(nodo);
            }

            var $selectDropdown = $("#type");
            $selectDropdown.trigger('contentChanged');
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro",
        type: 'GET',
        dataType: 'json',
        headers: {
            'codigo': 'Modulo_Deteccion_Irregularidades'
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            var moduloDeteccionIrregularidades = document.getElementById("detectionModule");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.valor);
                nodo.appendChild(document.createTextNode(object.nombre));
                moduloDeteccionIrregularidades.appendChild(nodo);
            }

            var $selectDropdown = $("#detectionModule");
            $selectDropdown.trigger('contentChanged');
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro",
        type: 'GET',
        dataType: 'json',
        headers: {
            'codigo': 'Modulo_Visualizacion'
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            var moduloVisualizacion = document.getElementById("visualizationModule");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.valor);
                nodo.appendChild(document.createTextNode(object.nombre));
                moduloVisualizacion.appendChild(nodo);
            }

            var $selectDropdown = $("#visualizationModule");
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
    loadModule('equipo','equipo', 'Listado', null);
}

function aceptar() {
    var nombre = document.getElementById("name");
    var marca = document.getElementById("marca");
    var modelo = document.getElementById("model");
    var tipoEquipo = document.getElementById("type");
    var tipoConexion = document.getElementById("typeConnection");
    var url = document.getElementById("url");
    var moduloDeteccionIrregularidades = document.getElementById("detectionModule");
    var serial = document.getElementById("serial");

    document.getElementById("spinner").setAttribute("class", "");

    var uri = "/telemonitoreo-core/web/app_dev.php/equipomedico/";
    var headers = {
        'nombre': nombre.value,
        'marca': marca.value,
        'modelo': modelo.value,
        'tipoEquipo': tipoEquipo[tipoEquipo.value].text,
        'tipoConexion': tipoConexion[tipoConexion.value].text,
        'ip': url.value,
        'moduloDeteccionIrregularidades': moduloDeteccionIrregularidades[moduloDeteccionIrregularidades.value].text,
        'serial': serial.value
    };
    var urlRollBack = "equipo";

    save(uri, headers,urlRollBack, 'POST');
}

function displaySpinner() {
    contDisplaySpinner++;
    if (contDisplaySpinner==2){
        document.getElementById("spinner").setAttribute("class", "spinnerHidden");
    }
}