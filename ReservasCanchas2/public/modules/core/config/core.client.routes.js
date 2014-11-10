'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Ruta del home de la aplicacion 
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		// ruta del home de los estudiantes
		state('homeStudent', {
			url: '/homeStudent',
			templateUrl: 'modules/core/views/homeStudent.client.view.html'
		});
	}
]);