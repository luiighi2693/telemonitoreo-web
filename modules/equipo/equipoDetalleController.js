/**
 * Created by LRodriguez on 09/11/2016.
 */
var contDisplaySpinner = 0;
var id;
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
            var tipoEquipo = document.getElementById("tipo");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.valor);
                nodo.appendChild(document.createTextNode(object.nombre));
                tipoEquipo.appendChild(nodo);
            }

            var $selectDropdown = $("#tipo");
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
            'codigo': 'Modulo_Conexion'
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            var moduloConexion = document.getElementById("connectionModule");

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("option");
                nodo.setAttribute("value", object.valor);
                nodo.appendChild(document.createTextNode(object.nombre));
                moduloConexion.appendChild(nodo);
            }

            var $selectDropdown = $("#connectionModule");
            $selectDropdown.trigger('contentChanged');
        },
        error: function (error) {
            console.log(error);
        }
    });

    id = idDetail;

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            document.getElementById("name").value = data.nombre;
            document.getElementById("marca").value = data.marca;
            document.getElementById("model").value = data.modelo;
            document.getElementById("url").value = data.ip;
            document.getElementById("serial").value = data.serial;

            setTimeout(function(){
                getConnectionModule(data.moduloconexion);
                getValueMedicalEquipment(data.tipoequipo);
            }, 1500);

            var idTipoConexion;
            if(data.tipoconexion=="SINCRONA"){
                idTipoConexion=1;
            }else{
                idTipoConexion=2;
            }

            var $selectDropdown2 = $("#typeConnection");
            $selectDropdown2.val(idTipoConexion).change();
            $selectDropdown2.trigger('contentChanged');
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
    var tipoEquipo = document.getElementById("tipo");
    var tipoConexion = document.getElementById("typeConnection");
    var url = document.getElementById("url");
    var moduloConexion = document.getElementById("connectionModule");
    var serial = document.getElementById("serial");

    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+id,
        type: 'PUT',
        dataType: 'json',
        headers: {
            'nombre': nombre.value,
            'marca': marca.value,
            'modelo': modelo.value,
            'tipoEquipo': tipoEquipo[tipoEquipo.value].text,
            'tipoConexion': tipoConexion[tipoConexion.value].text,
            'ip': url.value,
            'moduloConexion': moduloConexion[moduloConexion.value].text,
            'serial': serial.value
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            console.log(data);
            loadModule('equipo','equipo', 'Listado', null);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getValueMedicalEquipment(tipoEquipo) {
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro",
        type: 'GET',
        dataType: 'json',
        headers: {
            'nombre': tipoEquipo
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            var $selectDropdown = $("#tipo");
            $selectDropdown.val(data[0].valor).change();
            $selectDropdown.trigger('contentChanged');
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getConnectionModule(moduloConexion) {
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro",
        type: 'GET',
        dataType: 'json',
        headers: {
            'nombre': moduloConexion
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            var $selectDropdown = $("#connectionModule");
            $selectDropdown.val(data[0].valor).change();
            $selectDropdown.trigger('contentChanged');
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function displaySpinner() {
    contDisplaySpinner++;
    if (contDisplaySpinner==5){
        document.getElementById("spinner").setAttribute("class", "spinnerHidden");
    }
}