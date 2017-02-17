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
    id = idDetail;
    var listaPacientes = [];
    var listaEquipos = [];
    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/historiaclinica",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
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

            $.ajax({
                url: "/telemonitoreo-core/web/app_dev.php/variablehaspaciente",
                async:false,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'idvariableclinica': id
                },
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    displaySpinner();
                    console.log(data);
                    for (var i=0; i<data.length; i++){
                        listaPacientes.push(data[i].id_historia_clinica);
                    }
                    var $selectDropdown = $("#pacientes");
                    $selectDropdown.val(listaPacientes);
                    $selectDropdown.trigger('contentChanged');
                },
                error: function (error) {
                    console.log(error);
                }
            });
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

            $.ajax({
                url: "/telemonitoreo-core/web/app_dev.php/variablehasequipo",
                async:false,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'idvariableclinica': id
                },
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    displaySpinner();
                    console.log(data);
                    for (var i=0; i<data.length; i++){
                        listaEquipos.push(data[i].id_equipo_medico);
                    }
                    var $selectDropdown = $("#equipos");
                    $selectDropdown.val(listaEquipos);
                    $selectDropdown.trigger('contentChanged');
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variableclinica/"+id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            displaySpinner();
            document.getElementById("name").value = data.nombre;
            document.getElementById("range").value = data.rango;
            document.getElementById("particularRange").value = data.rango_particular;
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
    var nombre =document.getElementById("name");
    var rango =document.getElementById("range");
    var rangoParticular =document.getElementById("particularRange");

    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variableclinica/"+id,
        type: 'PUT',
        dataType: 'json',
        headers: {
            'nombre': nombre.value,
            'rango': rango.value,
            'rangoparticular': rangoParticular.value
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var $selectDropdown = $("#pacientes");
            var pacientes = $selectDropdown.val();

            var $selectDropdown2 = $("#equipos");
            var equipos = $selectDropdown2.val();

            if(pacientes!=null || equipos!=null){
                var i=0;
                if(equipos!=null){
                    for (i=0; i<equipos.length; i++){
                        setVariableToEquip(data.id, equipos[i]);
                    }
                }

                if(pacientes!=null){
                    for (i=0; i<pacientes.length; i++){
                        setVariableToPatient(data.id, pacientes[i]);
                    }
                }

            }else{
                document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            }
            loadModule('variable','variable', 'Listado', null);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setVariableToPatient(idVariableClinica, idHistoriaClinica) {
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variablehaspaciente/",
        type: 'POST',
        dataType: 'json',
        headers: {
            'idhistoriaclinica': idHistoriaClinica,
            'idvariableclinica': idVariableClinica
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function setVariableToEquip(idVariableClinica, idEquipoMedico) {
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variablehasequipo/",
        type: 'POST',
        dataType: 'json',
        headers: {
            'idequipomedico': idEquipoMedico,
            'idvariableclinica': idVariableClinica
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function displaySpinner() {
    contDisplaySpinner++;
    if (contDisplaySpinner==2){
        document.getElementById("spinner").setAttribute("class", "spinnerHidden");
    }
}