'use strict';

//Setting up route
angular.module('reservas').config(['$stateProvider',
	function($stateProvider) {
		// Reservas state routing
		$stateProvider.
		state('listReservas', {
			url: '/reservas',
			templateUrl: 'modules/reservas/views/list-reservas.client.view.html'
		}).
		state('createReserva', {
			url: '/reservas/create',
			templateUrl: 'modules/reservas/views/create-reserva.client.view.html'
		}).
		state('viewReserva', {
			url: '/reservas/:reservaId',
			templateUrl: 'modules/reservas/views/view-reserva.client.view.html'
		}).
		state('editReserva', {
			url: '/reservas/:reservaId/edit',
			templateUrl: 'modules/reservas/views/edit-reserva.client.view.html'
		});
	}
]);