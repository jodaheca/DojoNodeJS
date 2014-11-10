'use strict';

// Reservas controller
angular.module('reservas').controller('ReservasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reservas',
	function($scope, $stateParams, $location, Authentication, Reservas ) {
		$scope.authentication = Authentication;

		// Create new Reserva
		$scope.create = function() {
			// Create new Reserva object
			var reserva = new Reservas ({
				persona: this.persona,
				tipo_espacio: this.tipo_espacio,
				numero_espacio: this.numero_espacio,
				fecha : this.fecha,
				hora : this.hora

			});

			// Redirect after save
			reserva.$save(function(response) {
				$location.path('reservas/' + response._id);

				// Clear form fields
				$scope.persona = '';
				$scope.tipo_espacio = '';
				$scope.numero_espacio = '';
				$scope.fecha = '';
				$scope.hora = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Reserva
		$scope.remove = function( reserva ) {
			if ( reserva ) { reserva.$remove();

				for (var i in $scope.reservas ) {
					if ($scope.reservas [i] === reserva ) {
						$scope.reservas.splice(i, 1);
					}
				}
			} else {
				$scope.reserva.$remove(function() {
					$location.path('reservas');
				});
			}
		};

		// Update existing Reserva
		$scope.update = function() {
			var reserva = $scope.reserva ;

			reserva.$update(function() {
				$location.path('reservas/' + reserva._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reservas
		$scope.find = function() {
			$scope.reservas = Reservas.query();
		};

		// Find existing Reserva
		$scope.findOne = function() {
			$scope.reserva = Reservas.get({ 
				reservaId: $stateParams.reservaId
			});
		};
	}
]);