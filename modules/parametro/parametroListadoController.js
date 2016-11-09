/**
 * Created by LRodriguez on 09/11/2016.
 */
var idSelectedForDelete;

$( document ).ready(function() {
    var ids = ['name', 'code', 'value'];
    var names = ['Nombre', 'Código', 'Valor'];
    setTable("dinamicTableType", ids, names, "cuerpoTablaTiposEquipo");
    setTable("dinamicTableConnection", ids, names, "cuerpoTablaModuloConexion");
    setTable("dinamicTableVisualization", ids, names, "cuerpoTablaModuloVisualizacion");
    $('#modalDelete').load('modalDelete.html');

    if(sessionStorage.getItem("rol")!="Administrador"){
        document.getElementById("params").setAttribute("style", "display:none");
        document.getElementById("paramsMobile").setAttribute("style", "display:none");
    }

    listTable();
});

function listTable() {
    document.getElementById("spinner").setAttribute("class", "");
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro",
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            var tablaTiposEquipo = document.getElementById("cuerpoTablaTiposEquipo");
            tablaTiposEquipo.innerHTML = '';
            var tablaModuloConexion = document.getElementById("cuerpoTablaModuloConexion");
            tablaModuloConexion.innerHTML = '';
            var tablaModuloVisualizacion = document.getElementById("cuerpoTablaModuloVisualizacion");
            tablaModuloVisualizacion.innerHTML = '';

            for (var i=0; i<data.length; i++){
                var object = data[i];
                var nodo = document.createElement("tr");

                var removeRow = document.createElement("td");
                var removeLink = document.createElement("a");
                removeLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light red modal-trigger");
                removeLink.setAttribute("onclick", "selectForDelete("+object.id+")");
                removeLink.setAttribute("href", "#modalDelete");
                var removeIcon = document.createElement("i");
                removeIcon.setAttribute("class", "material-icons");
                removeIcon.appendChild(document.createTextNode("remove"));
                removeLink.appendChild(removeIcon);
                removeRow.appendChild(removeLink);
                nodo.appendChild(removeRow);

                var editRow = document.createElement("td");
                var editLink = document.createElement("a");
                editLink.setAttribute("class", "btn-floating btn-small waves-effect waves-light blue");
                editLink.setAttribute("onclick", "loadModule('parametro','parametro', 'Detalle', "+object.id+")");
                var editIcon = document.createElement("i");
                editIcon.setAttribute("class", "material-icons");
                editIcon.appendChild(document.createTextNode("edit"));
                editLink.appendChild(editIcon);
                editRow.appendChild(editLink);
                nodo.appendChild(editRow);

                var nombre = document.createElement("td");
                nombre.appendChild(document.createTextNode(object.nombre));
                nodo.appendChild(nombre);

                var codigo = document.createElement("td");
                codigo.appendChild(document.createTextNode(object.codigo));
                nodo.appendChild(codigo);

                var valor = document.createElement("td");
                valor.appendChild(document.createTextNode(object.valor));
                nodo.appendChild(valor);

                if(object.codigo == "Equipo_Medico"){
                    tablaTiposEquipo.appendChild(nodo);
                }
                if(object.codigo == "Modulo_Conexion"){
                    tablaModuloConexion.appendChild(nodo);
                }
                if(object.codigo == "Modulo_Visualizacion"){
                    tablaModuloVisualizacion.appendChild(nodo);
                }
            }
            $('.modal-trigger').leanModal();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function selectForDelete(id) {
    idSelectedForDelete = id;
    console.log(idSelectedForDelete);
}

function eliminar() {
    document.getElementById("spinner").setAttribute("class", "");
    $.ajax({
        url: "/telemonitoreo-core/web/app_dev.php/parametro/"+idSelectedForDelete,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            document.getElementById("spinner").setAttribute("class", "spinnerHidden");
            console.log(data);
            listTable();
        },
        error: function (error) {
            console.log(error);
        }
    });
}