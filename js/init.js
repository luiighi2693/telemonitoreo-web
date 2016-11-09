var idDetail;

(function($){
  $(function(){

    $('.button-collapse').sideNav();

    $('#mainContent').load('main.html');

    if (sessionStorage.getItem("usuario")==null){
      setTimeout(function(){
        alert("Usted no ha iniciado sesión");
        window.location = "login.html";
      }, 1500);
    }

    if(sessionStorage.getItem("rol")!="Administrador"){
      document.getElementById("params").setAttribute("style", "display:none");
      document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    idDetail=null;
  });
})(jQuery);

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
        loadModule(urlRollBack,urlRollBack, 'Listado', null);
      }
    },
    error: function (error) {
      console.log(error);
    }
  });
}

/**
 * Carga Script dinamicamente y los almacena temporalmente en cache
 * @param url
 * @param options
 * @returns {*}
 */
jQuery.cachedScript = function( url, options ) {
  options = $.extend( options || {}, {
    dataType: "script",
    cache: false,
    url: url
  });
  return jQuery.ajax( options );
};

function loadModule(modulo,nombre, accion, id) {
  if(id != null){
    idDetail = id;
  }else{
    idDetail = null;
  }
  $('#mainContent').load("modules/"+modulo+"/"+nombre+accion+".html");
  $.cachedScript("modules/"+modulo+"/"+nombre+accion+"Controller.js").done(function (script, textStatus) {});
}