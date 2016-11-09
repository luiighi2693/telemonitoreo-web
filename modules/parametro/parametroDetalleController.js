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
    id = idDetail;
    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro/"+id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");

            document.getElementById("name").value = data.nombre;
            document.getElementById("code").value = data.codigo;
            document.getElementById("value").value = data.valor;
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function cancelar() {
    loadModule('parametro','parametro', 'Listado', null);
}

function aceptar() {
    var nombre = document.getElementById("name");
    var codigo = document.getElementById("code");
    var valor = document.getElementById("value");
    document.getElementById("spinner").setAttribute("class", "");

    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro/"+id,
        type: 'PUT',
        dataType: 'json',
        headers: {
            'nombre': nombre.value,
            'codigo': codigo.value,
            'valor': valor.value
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            console.log(data);
            loadModule('parametro','parametro', 'Listado', null);
        },
        error: function (error) {
            console.log(error);
        }
    });
}