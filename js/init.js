(function($){
  $(function(){

    $('.button-collapse').sideNav();
    console.log("hola");
  }); // end of document ready
})(jQuery); // end of jQuery name space

function exit() {
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("rol");
  window.location = "login.html";
}