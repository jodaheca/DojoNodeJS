'use strict';

(function() {
	// Reservas Controller Spec
	describe('Reservas Controller Tests', function() {
		// Initialize global variables
		var ReservasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Reservas controller.
			ReservasController = $controller('ReservasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Reserva object fetched from XHR', inject(function(Reservas) {
			// Create sample Reserva using the Reservas service
			var sampleReserva = new Reservas({
				name: 'New Reserva'
			});

			// Create a sample Reservas array that includes the new Reserva
			var sampleReservas = [sampleReserva];

			// Set GET response
			$httpBackend.expectGET('reservas').respond(sampleReservas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reservas).toEqualData(sampleReservas);
		}));

		it('$scope.findOne() should create an array with one Reserva object fetched from XHR using a reservaId URL parameter', inject(function(Reservas) {
			// Define a sample Reserva object
			var sampleReserva = new Reservas({
				name: 'New Reserva'
			});

			// Set the URL parameter
			$stateParams.reservaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/reservas\/([0-9a-fA-F]{24})$/).respond(sampleReserva);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reserva).toEqualData(sampleReserva);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Reservas) {
			// Create a sample Reserva object
			var sampleReservaPostData = new Reservas({
				name: 'New Reserva'
			});

			// Create a sample Reserva response
			var sampleReservaResponse = new Reservas({
				_id: '525cf20451979dea2c000001',
				name: 'New Reserva'
			});

			// Fixture mock form input values
			scope.name = 'New Reserva';

			// Set POST response
			$httpBackend.expectPOST('reservas', sampleReservaPostData).respond(sampleReservaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Reserva was created
			expect($location.path()).toBe('/reservas/' + sampleReservaResponse._id);
		}));

		it('$scope.update() should update a valid Reserva', inject(function(Reservas) {
			// Define a sample Reserva put data
			var sampleReservaPutData = new Reservas({
				_id: '525cf20451979dea2c000001',
				name: 'New Reserva'
			});

			// Mock Reserva in scope
			scope.reserva = sampleReservaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/reservas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/reservas/' + sampleReservaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid reservaId and remove the Reserva from the scope', inject(function(Reservas) {
			// Create new Reserva object
			var sampleReserva = new Reservas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Reservas array and include the Reserva
			scope.reservas = [sampleReserva];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/reservas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReserva);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.reservas.length).toBe(0);
		}));
	});
}());