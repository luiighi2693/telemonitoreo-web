/**
 * Created by luisc on 1/11/2016.
 */
routerApp.controller('pacienteNuevoController', function($scope, $state) {

    $scope.cancelar =function () {
        $state.go('pacienteListado');
    };

    $scope.aceptar =function () {
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
        var urlRollBack = "pacienteListado";

        $scope.save(uri, headers,urlRollBack, 'POST');
    };

    $scope.save = function (uri, headers, urlRollBack, type) {
        $.ajax({
            url: uri,
            type: type,
            dataType: 'json',
            headers: headers,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinner").setAttribute("class", "spinnerHidden");
                if(urlRollBack!=null){
                    $state.go(urlRollBack);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
});