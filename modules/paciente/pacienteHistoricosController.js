/**
 * Created by luisc on 8/11/2016.
 */
$( document ).ready(function() {

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    $('.modal-trigger').leanModal();

    if (sessionStorage.getItem("rol")=="Administrador"){
        listTableAllAdministrator();
    }else{
        listTableAll();
    }
});

function listTableAll() {
    document.getElementById("spinner").setAttribute("class", "");
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/historicos",
        type: 'GET',
        dataType: 'json',
        headers: {
            'nombreusuario': sessionStorage.getItem("usuario")
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            listTable(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function listTableAllAdministrator() {
    document.getElementById("spinner").setAttribute("class", "");
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/historicos",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            listTable(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function listTable(data) {
    var tabla = document.getElementById("cuerpoTabla");
    tabla.innerHTML = '';

    for (var i=0; i<data.length; i++){
        var object = data[i];
        var nodo = document.createElement("tr");

        var cedula_paciente = document.createElement("td");
        cedula_paciente.appendChild(document.createTextNode(object.cedula_paciente));
        nodo.appendChild(cedula_paciente);

        var accion = document.createElement("td");
        accion.appendChild(document.createTextNode(object.accion));
        nodo.appendChild(accion);

        var fecha = document.createElement("td");
        fecha.appendChild(document.createTextNode(object.fecha));
        nodo.appendChild(fecha);

        var observacion_paciente = document.createElement("td");
        observacion_paciente.appendChild(document.createTextNode(object.observacion_paciente));
        nodo.appendChild(observacion_paciente);

        tabla.appendChild(nodo);
    }
}

function buscar() {
    if (sessionStorage.getItem("rol")=="Administrador"){
        buscarForAdministrador();
    }else{
        buscarForMedico();
    }
}

function buscarForMedico() {
    if(document.getElementById("cedula").value != ""){
        document.getElementById("spinner").setAttribute("class", "");
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/historicos",
            type: 'GET',
            dataType: 'json',
            headers: {
                'nombreusuario': sessionStorage.getItem("usuario"),
                'cedulapaciente': document.getElementById("cedula").value
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinner").setAttribute("class", "spinnerHidden");
                listTable(data);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }else{
        listTableAll();
    }
    document.getElementById("cedula").value = "";
}

function buscarForAdministrador() {
    if(document.getElementById("cedula").value != ""){
        document.getElementById("spinner").setAttribute("class", "");
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/historicos",
            type: 'GET',
            dataType: 'json',
            headers: {
                'cedulapaciente': document.getElementById("cedula").value
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinner").setAttribute("class", "spinnerHidden");
                listTable(data);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }else{
        listTableAll();
    }
    document.getElementById("cedula").value = "";
}