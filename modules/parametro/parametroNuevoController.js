/**
 * Created by LRodriguez on 09/11/2016.
 */
$( document ).ready(function() {
    $('#submitFormButtons').load('submitFormButton.html');

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }
});

function cancelar() {
    loadModule('parametro','parametro', 'Listado', null);
}

function aceptar() {
    var nombre = document.getElementById("name");
    var codigo = document.getElementById("code");
    var valor = document.getElementById("value");
    document.getElementById("spinner").setAttribute("class", "");

    var uri = "/telemonitoreo-core/web/app_dev.php/parametro/";
    var headers = {
        'nombre': nombre.value,
        'codigo': codigo.value,
        'valor': valor.value
    };
    var urlRollBack = "parametro";

    save(uri, headers,urlRollBack, 'POST');
}