/**
 * Created by LRodriguez on 27/10/2016.
 */
function exit() {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("rol");
    window.location = "login.html";
}