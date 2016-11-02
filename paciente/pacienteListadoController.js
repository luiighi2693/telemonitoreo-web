/**
 * Created by luisc on 1/11/2016.
 */
routerApp.controller('pacienteListadoController', function($scope, $state, $compile, $rootScope) {

    $rootScope.idSelectedForDelete = undefined;

    if(sessionStorage.getItem("rol")=="Administrador" || sessionStorage.getItem("rol")=="Estudiante"){
        document.getElementById("addPatient").setAttribute("style", "display:none");
        document.getElementById("editRow").setAttribute("style", "display:none");
        document.getElementById("deleteRow").setAttribute("style", "display:none");

        if(sessionStorage.getItem("rol")=="Estudiante"){
            document.getElementById("historical").setAttribute("style", "display:none");
        }
    }

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }



    $scope.listTable = function () {
        document.getElementById("spinner").setAttribute("class", "");
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/historiaclinica",
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinner").setAttribute("class", "spinnerHidden");
                var tabla = document.getElementById("cuerpoTabla");
                tabla.innerHTML = '';

                for (var i=0; i<data.length; i++){
                    var object = data[i];
                    var nodo = document.createElement("tr");

                    if(sessionStorage.getItem("rol")!="Administrador" && sessionStorage.getItem("rol")!="Estudiante"){
                        var removeRow = document.createElement("td");
                        var removeLink = document.createElement("a");
                        removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
                        removeLink.setAttribute("ng-click", "selectForDelete("+object.id+")");
                        removeLink.setAttribute("href", "#modalDelete");
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
                        editLink.setAttribute("href", "#/pacienteDetalle?id="+object.id);
                        var editIcon = document.createElement("i");
                        editIcon.setAttribute("class", "material-icons");
                        editIcon.appendChild(document.createTextNode("edit"));
                        editLink.appendChild(editIcon);
                        editRow.appendChild(editLink);
                        nodo.appendChild(editRow);
                    }

                    var codigo = document.createElement("td");
                    codigo.appendChild(document.createTextNode(object.codigo));
                    nodo.appendChild(codigo);

                    var nombre_paciente = document.createElement("td");
                    nombre_paciente.appendChild(document.createTextNode(object.nombre_paciente));
                    nodo.appendChild(nombre_paciente);

                    var cedula_paciente = document.createElement("td");
                    cedula_paciente.appendChild(document.createTextNode(object.cedula_paciente));
                    nodo.appendChild(cedula_paciente);

                    tabla.appendChild(nodo);
                }

                $('.modal-trigger').leanModal();
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    $scope.selectForDelete = function(id) {
        $rootScope.idSelectedForDelete = id;
    };

    $scope.eliminar = function() {
        document.getElementById("spinner").setAttribute("class", "");
        $.ajax({
            url: "/telemonitoreo-core/web/app_dev.php/historiaclinica/"+$rootScope.idSelectedForDelete,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'usuario': sessionStorage.getItem("usuario"),
                'fecha': getFecha()
            },
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                document.getElementById("spinner").setAttribute("class", "spinnerHidden");
                $scope.listTable();
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    $scope.listTable();
});