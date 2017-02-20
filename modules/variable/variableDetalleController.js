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
    var listaEquipos = [];
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
                        for(var j=0; j<document.getElementById("cuerpoTabla").childNodes.length;j++){
                            if(data[i].id_historia_clinica==document.getElementById("cuerpoTabla").childNodes[j].childNodes[0].childNodes[0].id){
                                document.getElementById("cuerpoTabla").childNodes[j].childNodes[0].childNodes[0].checked = true;
                                document.getElementById("cuerpoTabla").childNodes[j].childNodes[1].childNodes[0].value = data[i].rango_particular;
                            }
                        }
                    }
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

    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variableclinica/"+id,
        type: 'PUT',
        dataType: 'json',
        headers: {
            'nombre': nombre.value,
            'rango': rango.value
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var $selectDropdown = $("#equipos");
            var equipos = $selectDropdown.val();
            var pacientes  = null;

            for(var j=0; j<document.getElementById("cuerpoTabla").childNodes.length;j++){
                if(document.getElementById("cuerpoTabla").childNodes[j].childNodes[0].childNodes[0].checked){
                    pacientes = true;
                }
            }


            if(pacientes!=null || equipos!=null){
                var i=0;
                if(equipos!=null){
                    for (i=0; i<equipos.length; i++){
                        setVariableToEquip(data.id, equipos[i]);
                    }
                }

                if(pacientes!=null){
                    for(j=0; j<document.getElementById("cuerpoTabla").childNodes.length;j++){
                        if(document.getElementById("cuerpoTabla").childNodes[j].childNodes[0].childNodes[0].checked){
                            setVariableToPatient(data.id, document.getElementById("cuerpoTabla").childNodes[j].childNodes[0].childNodes[0].id, document.getElementById("cuerpoTabla").childNodes[j].childNodes[1].childNodes[0].value);
                        }
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

function setVariableToPatient(idVariableClinica, idHistoriaClinica, rangoParticular) {
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/variablehaspaciente/",
        type: 'POST',
        dataType: 'json',
        headers: {
            'idhistoriaclinica': idHistoriaClinica,
            'idvariableclinica': idVariableClinica,
            'rangoParticular' : rangoParticular
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