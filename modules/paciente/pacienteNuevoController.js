/**
 * Created by luisc on 8/11/2016.
 */
$( document ).ready(function() {

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }
});

function cancelar() {
    loadModule('paciente','paciente', 'Listado', null);
}

function aceptar() {
    var nombre = document.getElementById("name");
    var cedula = document.getElementById("cedula");
    var codigo = document.getElementById("codigo");

    document.getElementById("spinner").setAttribute("class", "");

    var uri = "/telemonitoreo-core/web/app_dev.php/historiaclinica/";
    var headers = {
        'codigo': codigo.value,
        'cedula': cedula.value,
        'nombre': nombre.value,
        'usuario': sessionStorage.getItem("usuario"),
        'fecha': getFecha()
    };
    var urlRollBack = "pacienteListado.html";

    save(uri, headers,'paciente', 'POST');
}