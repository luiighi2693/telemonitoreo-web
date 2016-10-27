/**
 * Created by LRodriguez on 27/10/2016.
 */
$( document ).ready(function() {
    $("#nav").load("nav.html");
    $("#footer").load("footer.html");

    if (sessionStorage.getItem("usuario")==null){
        setTimeout(function(){
            alert("Usted no ha iniciado sesión");
            window.location = "login.html";
        }, 1500);
    }
});

function exit() {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("rol");
    window.location = "login.html";
}