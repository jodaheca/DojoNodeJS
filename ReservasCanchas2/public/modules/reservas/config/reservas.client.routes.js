'use strict';
//Setting up route
angular.module('reservas').config(['$stateProvider',
    function ($stateProvider) {
    // Reservas state routing
    $stateProvider.
      state('reserva-estudiante', {
        url: '/reserva-estudiante',
        templateUrl: 'modules/reservas/views/reserva-estudiante.client.view.html'
      }).
      state('listReservas', {
        url: '/reservas',
        templateUrl: 'modules/reservas/views/list-reservas.client.view.html'
      }).
      state('listReservasEspacio', {
        url: '/reservasEspacio/:espacioId',
        templateUrl: 'modules/reservas/views/list-reservasEspacio.client.view.html'
      }).
      state('listReservasSemana', {
        url: '/reservasSemana',
        templateUrl: 'modules/reservas/views/reservasSemana.client.view.html'
      }).
      state('createReserva', {
        url: '/reservas/create',
        templateUrl: 'modules/reservas/views/create-reserva.client.view.html'
      }).
      state('viewReserva', {
        url: '/reservas/:reservaId',
        templateUrl: 'modules/reservas/views/view-reserva.client.view.html'
      }).
      state('model', {
        url: '/modelo/:espacioId',
        templateUrl: 'modules/reservas/views/model.client.view.html'
      }).
      state('editReserva', {
        url: '/reservas/:reservaId/edit',
        templateUrl: 'modules/reservas/views/edit-reserva.client.view.html'
      });
  }
  ]);