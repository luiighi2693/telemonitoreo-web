var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: 'main.html',
            controller: "mainController"
        })

        .state('pacienteListado', {
            url: '/pacienteListado',
            templateUrl: 'paciente/pacienteListado.html',
            controller: "pacienteListadoController"
        })

        .state('pacienteDetalle', {
            url: '/pacienteDetalle',
            templateUrl: 'paciente/pacienteDetalle.html',
            controller: "pacienteDetalleController"
        })

        .state('pacienteNuevo', {
            url: '/pacienteNuevo',
            templateUrl: 'paciente/pacienteNuevo.html',
            controller: "pacienteNuevoController"
        });
});

