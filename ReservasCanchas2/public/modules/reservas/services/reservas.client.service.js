'use strict';

//Reservas service used to communicate Reservas REST endpoints
angular.module('reservas').factory('Reservas', ['$resource',
	function($resource) {
		return $resource('reservas/:reservaId', { reservaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);