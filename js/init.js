(function($){
  $(function(){

    $('.button-collapse').sideNav();

    if (sessionStorage.getItem("usuario")==null){
      setTimeout(function(){
        alert("Usted no ha iniciado sesión");
        window.location = "login.html";
      }, 1500);
    }
  }); // end of document ready
})(jQuery); // end of jQuery name space

function exit() {
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("rol");
  window.location = "login.html";
}