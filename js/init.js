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

function getFecha() {
  var fecha = new Date();
  return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"  "+fecha.getHours()+":"+(fecha.getMinutes() < 10 ? "0"+fecha.getMinutes() : fecha.getMinutes())+":"+(fecha.getSeconds() < 10 ? "0"+fecha.getSeconds() : fecha.getSeconds());
}

function save(uri, headers, urlRollBack, type){
  $.ajax({
    url: uri,
    type: type,
    dataType: 'json',
    headers: headers,
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      document.getElementById("spinner").setAttribute("class", "spinnerHidden");
      if(urlRollBack!=null){
        window.location= urlRollBack;
      }
    },
    error: function (error) {
      console.log(error);
    }
  });
}
