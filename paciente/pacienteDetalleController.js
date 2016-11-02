/**
 * Created by luisc on 1/11/2016.
 */
routerApp.controller('pacienteDetalleController', function($scope, $rootScope, $state, $compile) {

    if($rootScope.idPaciente == undefined){
        if(sessionStorage.getItem("idPaciente")!=null){
            $rootScope.idPaciente = sessionStorage.getItem("idPaciente");
            sessionStorage.removeItem("idPaciente");
        }else{
            $state.go("pacienteListado");
        }
    }

    $rootScope.idVinculoSelectedForDelete = undefined;
    $rootScope.idRegistroSelectedForDelete = undefined;
    $rootScope.contDisplaySpinner = 0;

        if(sessionStorage.getItem("rol")!="Administrador"){
            document.getElementById("params").setAttribute("style", "display:none");
            document.getElementById("paramsMobile").setAttribute("style", "display:none");
        }

        $('.modal-trigger').leanModal();

        $('select').material_select();

        document.getElementById("spinner").setAttribute("class", "");

        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/historiaclinica/"+$rootScope.idPaciente,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $scope.displaySpinner();
                document.getElementById("name").value = data.nombre_paciente;
                document.getElementById("cedula").value = data.cedula_paciente;
                document.getElementById("hcNumber").value = data.codigo;
            },
            error: function (error) {
                console.log(error);
            }
        });

        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/equipomedico",
            type: 'GET',
            dataType: 'json',
            headers: {
                'idhistoriaclinica': $rootScope.idPaciente
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $scope.displaySpinner();

                var tablaEquipos = document.getElementById("cuerpoTablaEquipos");
                tablaEquipos.innerHTML = '';

                for (var i=0; i<data.length; i++){
                    var object = data[i];
                    var nodo = document.createElement("tr");

                    var removeRow = document.createElement("td");
                    var removeLink = document.createElement("a");
                    removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
                    removeLink.setAttribute("ng-click", "selectVinculoForDelete("+object.id+")");
                    var removeIcon = document.createElement("i");
                    removeLink.setAttribute("href", "#modalVinculoDelete");
                    removeIcon.setAttribute("class", "material-icons");
                    removeIcon.appendChild(document.createTextNode("remove"));
                    removeLink.appendChild(removeIcon);
                    removeRow.appendChild(removeLink);
                    $compile(removeRow)($scope);
                    nodo.appendChild(removeRow);

                    var editRow = document.createElement("td");
                    if(object.tipoconexion=="SINCRONA"){
                        var editLink = document.createElement("a");
                        editLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light blue");
                        var editIcon = document.createElement("i");
                        editIcon.setAttribute("class", "material-icons");
                        editIcon.appendChild(document.createTextNode("visibility"));
                        editLink.appendChild(editIcon);
                        editRow.appendChild(editLink);
                    }
                    nodo.appendChild(editRow);

                    var nombre = document.createElement("td");
                    nombre.appendChild(document.createTextNode(object.nombre+" "+object.marca+" "+object.modelo+" "+object.serial));
                    nodo.appendChild(nombre);

                    var tipoequipo = document.createElement("td");
                    tipoequipo.appendChild(document.createTextNode(object.tipoequipo));
                    nodo.appendChild(tipoequipo);

                    var ip = document.createElement("td");
                    ip.appendChild(document.createTextNode(object.ip));
                    nodo.appendChild(ip);

                    var tipoconexion = document.createElement("td");
                    tipoconexion.appendChild(document.createTextNode(object.tipoconexion));
                    nodo.appendChild(tipoconexion);

                    tablaEquipos.appendChild(nodo);
                }
                $('.modal-trigger').leanModal();
            },
            error: function (error) {
                console.log(error);
            }
        });

        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/equipomedico",
            type: 'GET',
            dataType: 'json',
            headers: {
                'idhistoriaclinica': 'all'
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $scope.displaySpinner();

                var equiposDisponibles = document.getElementById("type");

                for (var i=0; i<data.length; i++){
                    var object = data[i];
                    var nodo = document.createElement("option");
                    nodo.setAttribute("value", object.id);
                    nodo.appendChild(document.createTextNode(object.nombre+" "+object.marca+" "+object.modelo+" "+object.serial));
                    equiposDisponibles.appendChild(nodo);

                    var $selectDropdown = $("#type");
                    $selectDropdown.trigger('contentChanged');
                }
            },
            error: function (error) {
                console.log(error);
            }
        });

        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/registro",
            type: 'GET',
            dataType: 'json',
            headers: {
                'idhistoriaclinica': $rootScope.idPaciente
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $scope.displaySpinner();

                var cuerpoTablaRegistros = document.getElementById("cuerpoTablaRegistros");
                cuerpoTablaRegistros.innerHTML = '';

                for (var i=0; i<data.length; i++){
                    var object = data[i];
                    var nodo = document.createElement("tr");

                    $scope.getNombreEquipo(object, nodo, cuerpoTablaRegistros);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });

        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/historicos",
            type: 'GET',
            dataType: 'json',
            headers: {
                'idhistoriaclinica': $rootScope.idPaciente
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $scope.displaySpinner();

                var tablaHistoricos = document.getElementById("cuerpoTablaHistoricos");
                tablaHistoricos.innerHTML = '';

                for (var i=0; i<data.length; i++){
                    var object = data[i];
                    var nodo = document.createElement("tr");

                    var nombreusuario = document.createElement("td");
                    nombreusuario.appendChild(document.createTextNode(object.nombreusuario));
                    nodo.appendChild(nombreusuario);

                    var accion = document.createElement("td");
                    accion.appendChild(document.createTextNode(object.accion));
                    nodo.appendChild(accion);

                    var fecha = document.createElement("td");
                    fecha.appendChild(document.createTextNode(object.fecha));
                    nodo.appendChild(fecha);

                    var observacion_paciente = document.createElement("td");
                    observacion_paciente.appendChild(document.createTextNode(object.observacion_paciente));
                    nodo.appendChild(observacion_paciente);

                    tablaHistoricos.appendChild(nodo);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });

    $('select').on('contentChanged', function() {
        $(this).material_select();
    });

    $scope.aceptarModal = function() {
        if(document.getElementById("type").value!=""){
            document.getElementById("spinnerEquipos").setAttribute("class", "");
            $.ajax({
                url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+document.getElementById("type").value,
                type: 'PUT',
                dataType: 'json',
                headers: {
                    'idhistoriaclinica': $rootScope.idPaciente,
                    'usuario': sessionStorage.getItem("usuario"),
                    'fecha': getFecha()
                },
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    document.getElementById("spinnerEquipos").setAttribute("class", "spinnerHidden");
                    sessionStorage.setItem("idPaciente", $rootScope.idPaciente);
                    window.location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    };

    $scope.selectVinculoForDelete = function(id) {
        $rootScope.idVinculoSelectedForDelete = id;
        console.log($rootScope.idVinculoSelectedForDelete);
    };

    $scope.eliminarVinculo = function() {
        document.getElementById("spinnerEquipos").setAttribute("class", "");
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+$rootScope.idVinculoSelectedForDelete,
            type: 'PUT',
            dataType: 'json',
            headers: {
                'idhistoriaclinica': "null",
                'usuario': sessionStorage.getItem("usuario"),
                'fecha': getFecha()
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinnerEquipos").setAttribute("class", "spinnerHidden");
                sessionStorage.setItem("idPaciente", $rootScope.idPaciente);
                window.location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    $scope.getNombreEquipo = function(object, nodo, cuerpoTablaRegistros) {
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/equipomedico/"+object.id,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                var removeRow = document.createElement("td");
                var removeLink = document.createElement("a");
                removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
                removeLink.setAttribute("ng-click", "selectForDeleteRegistro("+object.id+")");
                removeLink.setAttribute("href", "#modalRegistroDelete");
                var removeIcon = document.createElement("i");
                removeIcon.setAttribute("class", "material-icons");
                removeIcon.appendChild(document.createTextNode("remove"));
                removeLink.appendChild(removeIcon);
                removeRow.appendChild(removeLink);
                $compile(removeRow)($scope);
                nodo.appendChild(removeRow);

                var editRow = document.createElement("td");
                var editLink = document.createElement("a");
                editLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light blue");
                var editIcon = document.createElement("i");
                editIcon.setAttribute("class", "material-icons");
                editIcon.appendChild(document.createTextNode("visibility"));
                editLink.appendChild(editIcon);
                editRow.appendChild(editLink);
                nodo.appendChild(editRow);

                var nombre = document.createElement("td");
                nombre.appendChild(document.createTextNode(data.nombre+" "+data.marca+" "+data.modelo+" "+data.serial));
                nodo.appendChild(nombre);

                var fecha = document.createElement("td");
                fecha.appendChild(document.createTextNode(object.fecha));
                nodo.appendChild(fecha);

                var tipoarchivo = document.createElement("td");
                tipoarchivo.appendChild(document.createTextNode(object.tipoarchivo));
                nodo.appendChild(tipoarchivo);

                var moduloVisualizacion = document.createElement("td");
                moduloVisualizacion.appendChild(document.createTextNode(object.modulovisualizacion));
                nodo.appendChild(moduloVisualizacion);

                cuerpoTablaRegistros.appendChild(nodo);

                $('.modal-trigger').leanModal();
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    $scope.selectForDeleteRegistro = function(id) {
        $rootScope.idRegistroSelectedForDelete = id;
        console.log($rootScope.idRegistroSelectedForDelete);
    };

    $scope.eliminarRegistro = function() {
        document.getElementById("spinnerRegistros").setAttribute("class", "");
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/registro/"+$rootScope.idRegistroSelectedForDelete,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'usuario': sessionStorage.getItem("usuario"),
                'fecha': getFecha()
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinnerRegistros").setAttribute("class", "spinnerHidden");
                sessionStorage.setItem("idPaciente", $rootScope.idPaciente);
                window.location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    $scope.displaySpinner = function() {
        $rootScope.contDisplaySpinner++;
        if ($rootScope.contDisplaySpinner==5){
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
        }
    }

});