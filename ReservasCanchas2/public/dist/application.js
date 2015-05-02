'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'reservascanchas2';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('reservas');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

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
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController',
	["$scope", "Authentication", function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}]
);
'use strict';
angular.module('core').controller('HomeStudentclientcontroller',
    ["$scope", "$location", "Reservafechaestudiante", "Authentication", function ($scope, $location, Reservafechaestudiante, Authentication) {

    $scope.authentication = Authentication;

    // $scope.verificarDisponibilidad = function (espacioId) {
    //   $scope.authentication = Authentication;
    //   var codigoEspacio = espacioId;
    //   console.log('El codigo del espacion es:', codigoEspacio);
    //   var dt = new Date();
    //   // Dia de la semana;
    //   var dSemana = dt.getDay();
    //   var dMes = dt.getDate();
    //   console.log('Dia semana:', dSemana);

    //   // verificamos si esta consultando reservas para una Cancha sintetica
    //   if (codigoEspacio <= 3) {

    //     // Si el dia en que se hace la consulta es diferente al lunes entones no lo dejamos pasar
    //     if (dSemana !== 2) {
    //       // console.log('Recuerde que la reserva de las canchas Sinteticas se debe realizar los lunes de cada semana.');
    //       alert('La reserva de las canchas sintéticas se realizan los lunes de cada semana.');
    //       $location.path('/homeStudent');
    //     } else {
    //       var horaInicial = 2;
    //       var horaFinal = 5;
    //       var fechaInicial = new Date();
    //       var fechaFinal = new Date();
    //       fechaInicial.setDate(dMes);
    //       //Agregamos cuatro dias a la fecha para que retorne las reservas desde la fecha de hoy lunes, hasta el viernes
    //       fechaInicial.setHours(0);
    //       fechaInicial.setMinutes(0);
    //       fechaInicial.setSeconds(0);
    //       fechaFinal.setMilliseconds(0);
    //       fechaFinal.setDate(dMes + 4);
    //       fechaFinal.setHours(0);
    //       fechaFinal.setMinutes(0);
    //       fechaFinal.setSeconds(0);
    //       fechaFinal.setMilliseconds(0);
    //       console.log('fecha Inicial: ', fechaInicial);
    //       console.log('fecha Final: ', fechaFinal);

    //       Reservafechaestudiante.getReservaUsuario(fechaInicial, fechaFinal, $scope.authentication.user.identificacion)
    //         .success(function (res) {
    //           console.log('PETICION:', res);
    //           //$scope.reservas = res;
    //         })
    //           .error(function (err) {
    //           console.log('Error: ', err);
    //         });
    //     }
    //   }
    // };
  }]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('reservas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Reservas', 'reservas', 'dropdown', '/reservas(/create)?');
		Menus.addSubMenuItem('topbar', 'reservas', 'List Reservas', 'reservas');
		Menus.addSubMenuItem('topbar', 'reservas', 'New Reserva', 'reservas/create');
	}
]);
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
'use strict';

// Reservas controller
angular.module('reservas').controller('ReservasController', ["$scope", "$stateParams", "$location", "Authentication", "Reservas", "Reservaslista", "Reservafechaestudiante", "$modal", "$log", function ($scope, $stateParams, $location, Authentication, Reservas, Reservaslista, Reservafechaestudiante, $modal, $log) {

  $scope.authentication = Authentication;
  //Funcion para abrir un nuevo modal para registrar una reserva por parte de un estudiante.

  $scope.registrarReserva = function (size, diaSemana) {
    // var dia = diaSemana;
    var codigoEspacio = $stateParams.espacioId;
    $scope.horarios = [
      {
        codigo: 14,
        valor: '14PM-15PM'
      },
      {
        codigo: 15,
        valor: '15PM-16PM'
      },
      {
        codigo: 16,
        valor: '16PM-17PM'
      },
      {
        codigo: 17,
        valor: '17PM-18PM'
      }
    ];
    $scope.reservo = [
      {
        yaReservo: 0
      }
    ];
   // $scope.reservo = 1;
    if (codigoEspacio > 3) {   // La reserva es para una cancha sintetica
      $scope.horarios = [
        {
          codigo: 8,
          valor: '8AM-9AM'
        },
        {
          codigo: 9,
          valor: '9AM-10AM'
        },
        {
          codigo: 10,
          valor: '10AM-11AM'
        },
        {
          codigo: 11,
          valor: '11AM-12M'
        },
        {
          codigo: 14,
          valor: '14PM-15PM'
        },
        {
          codigo: 15,
          valor: '15PM-16PM'
        },
        {
          codigo: 16,
          valor: '16PM-17PM'
        },
        {
          codigo: 17,
          valor: '17PM-18PM'
        }
      ];
      var fecha = new Date();
      // Dia de la semana;
      var dSemanaActual = fecha.getDay();

      if (diaSemana !== dSemanaActual) {
        alert('La reserva de la cancha de tenis se debe realizar el mismo dia que esta sera utilizada');
        //$location.path('/homeStudent');
        return;
      }
    }
    console.log('Dia semana', diaSemana);
    console.log('Horarios:', $scope.horarios);
    //Metodo en el cual se maneja el modal mediante el cual los estudiantes realizan las reservas
    var modalReservaEstudiante = $modal.open({
      templateUrl: 'modules/reservas/views/reserva-estudiante.client.view.html',
      controller: ["$scope", "$modalInstance", "horarios", "reservo", function ($scope, $modalInstance, horarios, reservo) {
        $scope.horarios = horarios;
        $scope.reservo = reservo;
        $scope.diaSemana = diaSemana;
        $scope.codigoEspacio = codigoEspacio;
        $scope.authentication = Authentication;

        $scope.salirReserva = function () {
          $modalInstance.close();
        };

        $scope.reservar = function (hora) {
          $scope.horaReserva = hora;
          var dt = new Date();
          // Dia de la semana;
          var dSemana = dt.getDay();
          if (codigoEspacio <= 3) {
            $scope.tipo_espacio = 'Cancha Sintetica';
          } else {
            $scope.tipo_espacio = 'Cancha de Tenis';
            console.log('Dia semana: ', dSemana);
            console.log('Dia semana: ', diaSemana);
          }

          var dMes = dt.getDate();
          //var month = dt.getMonth();
          //var year = dt.getFullYear();
          var agregarDias =  $scope.diaSemana - dSemana;
          // Configuracion de la fecha de acuerdo a lo que escogio el estudiante.
          dt.setDate(dMes + agregarDias);
          dt.setHours(0);
          dt.setMinutes(0);
          dt.setSeconds(0);
          dt.setMilliseconds(0);
          console.log('Fecha Reserva: ', dt);
          console.log('Codigo Espacio Seleccionado: ', $scope.codigoEspacio);
          console.log('Espacio Seleccionado: ', $scope.tipo_espacio);
          console.log('Dia de la Semana Seleccionado : ', $scope.diaSemana);
          console.log('Esta es la hora seleccionada', $scope.horaReserva);
          console.log('Usuario: ', $scope.authentication.user.identificacion);

          // Creamos una variable para almacenar el objeto de la reserva que vamos a guardar
          var reserva = new Reservas({
            persona: $scope.authentication.user.identificacion,
            tipo_espacio: $scope.tipo_espacio,
            numero_espacio: $scope.codigoEspacio,
            fecha : dt,
            hora : $scope.horaReserva
          });
          // Guardo la reserva en db
          reserva.$save(function (response) {
            $scope.salirReserva();
            $location.path('reservas/' + response._id);
          },
            function (errorResponse) {
              $scope.error = errorResponse.data.message;
            });
        };
      }],
      size: size,
      resolve: {
        horarios: function () {
          return $scope.horarios;
        },
        reservo: function () {
          return $scope.reservo;
        }
      }
    });

    modalReservaEstudiante.result.then(function (horarioSelec) {
      $scope.horario = horarioSelec;
    }, function () {
      $log.info('Modal designe: ' + new Date());
    });
  };

    // Create new Reserva
  $scope.create = function () {
    // Create new Reserva object
    var reserva = new Reservas({
      persona: this.persona,
      tipo_espacio: this.tipo_espacio,
      numero_espacio: this.numero_espacio,
      fecha : this.fecha,
      hora : this.hora
    });

    // Redirect after save
    reserva.$save(function (response) {
      $location.path('reservas/' + response._id);

      // Clear form fields
      $scope.persona = '';
      $scope.tipo_espacio = '';
      $scope.numero_espacio = '';
      $scope.fecha = '';
      $scope.hora = '';
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

    // Remove existing Reserva
  $scope.remove = function (reserva) {
    $scope.authentication = Authentication;
    console.log('Tipo Usuario: ', $scope.authentication.user.tipoUser);
    var i;
    if (reserva) {
      reserva.$remove();

      for (i in $scope.reservas) {
        if ($scope.reservas[i] === reserva) {
          $scope.reservas.splice(i, 1);
        }
      }
    } else {
      $scope.reserva.$remove(function () {
        $scope.authentication = Authentication;
        console.log('Tipo Usuario: ', $scope.authentication.user.tipoUser);
        if ($scope.authentication.user.tipoUser == 2) { //Si es estudiante va a la pantalla principal
          alert('Reserva Eliminada Correctamente.');
          $location.path('homeStudent');
         // $location.path('/auth/signout');
        } else if ($scope.authentication.user.tipoUser == 1) { // Admnistrador va a ver las otras reservas
          $location.path('reservas');
        }
      });
    }
  };

  // Update existing Reserva
  $scope.update = function () {
    var reserva = $scope.reserva;

    reserva.$update(function () {
      $location.path('reservas/' + reserva._id);
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  // Find a list of Reservas
  $scope.find = function () {
    $scope.reservas = Reservas.query();
  };
  //Redirecionr al Principal del estudiante.

  $scope.principalEstudiante = function () {
    $location.path('/homeStudent');
  };

   //Redirecionr al Principal del admin.

  $scope.principalAdmin = function () {
    $location.path('/');
  };

  //Redirecionr a lalista de los estudiantes.
  $scope.listarReservas = function () {
    $location.path('/reservas');
  };

  // Metodo para obtener las reservas de un espacio especifico.
  $scope.BuscarPorEspacio = function () {
    console.log('Entro a la funcion BuscarPorEspacio');
    var espacioId = $stateParams.espacioId;
    console.log('Id del Tipo de Espacio', espacioId);
    Reservaslista.getReservas(espacioId)
      .success(function (res) {
        console.log('PETICION:', res);
        $scope.reservas = res;
      })
      .error(function (err) {
        console.log('Error: ', err);
      });
  };

  // Find existing Reserva
  $scope.findOne = function () {
    $scope.reserva = Reservas.get({
      reservaId: $stateParams.reservaId
    });
    //var rese = $scope.reserva;
    //console.log('Reserva: ', rese);
    //$scope.diaReserva =  rese.getDate();
  };
 //Metodo que regresa las reservas que tenga una persona en un rango de fechas
  $scope.verificarDisponibilidad = function (espacioId) {

    $scope.authentication = Authentication;
    var codigoEspacio = espacioId;
    console.log('El codigo del espacion es:', codigoEspacio);
    var dt = new Date();
    // Dia de la semana;
    var dSemana = dt.getDay();
    var dMes = dt.getDate();
    console.log('Dia semana:', dSemana);

    var fechaInicial = new Date();
    var fechaFinal = new Date();
    fechaInicial.setDate(dMes);
    fechaInicial.setHours(0);
    fechaInicial.setMinutes(0);
    fechaInicial.setSeconds(0);
    fechaFinal.setMilliseconds(0);
    fechaFinal.setDate(dMes + 4);
    fechaFinal.setHours(0);
    fechaFinal.setMinutes(0);
    fechaFinal.setSeconds(0);
    fechaFinal.setMilliseconds(0);

    console.log('fecha Inicial: ', fechaInicial);
    console.log('fecha Final: ', fechaFinal);

        // verificamos si esta consultando reservas para una Cancha sintetica        
    if (codigoEspacio <= 3) {

      // Si el dia en que se hace la consulta es diferente al lunes entones no lo dejamos pasar
      if (dSemana == 5) {
        console.log('Recuerde que la reserva de las canchas Sinteticas se debe realizar los lunes de cada semana.');
        alert('La reserva de las canchas sintéticas se realizan los lunes de cada semana.');
        $location.path('/homeStudent');
        return;
      }
      //Metodo que consume el servicio web que recibe las fechas y la cedula de la persona y retorna una lista con las reservas
      Reservafechaestudiante.getReservaUsuario(fechaInicial, fechaFinal, $scope.authentication.user.identificacion)
        .success(function (res) {
          console.log('PETICION:', res);
          var reservas = res;
          if (reservas.length !== 0) {
            var reser = reservas[0];
            console.log(reser);
            console.log('Señor Usuario ya usted tiene una reserva para esta semana.');
            alert('Señor Usuario  usted ya tiene una reserva para esta semana.');
            $location.path('reservas/' + reser._id);
            return;

          }
          $location.path('modelo/' + espacioId);
          return;
        })
          .error(function (err) {
          console.log('Error: ', err);
        });
    } else { // Va a reservas una cancha De tenis
      //Metodo que consume el servicio web que recibe las fechas y la cedula de la persona y retorna una lista con las reservas
      Reservafechaestudiante.getReservaUsuario(fechaInicial, fechaFinal, $scope.authentication.user.identificacion)
        .success(function (res) {
          console.log('PETICION:', res);
          var reservas = res;
          if (reservas.length !== 0) {
            var reser = reservas[0];
            console.log(reser);
            console.log('Señor Usuario ya usted tiene una reserva para esta semana.');
            alert('Señor Usuario  usted ya tiene una reserva para esta semana.');
            $location.path('reservas/' + reser._id);
            return;

          }
          $location.path('modelo/' + espacioId);
          return;
        })
          .error(function (err) {
          console.log('Error: ', err);
        });
    }
  };

  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  };

  $scope.toggleMin = function () {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
}]);
'use strict';

angular.module('reservas').factory('Reservafechaestudiante', ["$http", function ($http) {

  // Public API
  return {
    getReservaUsuario: function (fechaInicial, fechaFinal, usuarioId) {
      return $http({
        url: '/reservaFechaUsuario/' + fechaInicial + '/' + fechaFinal + '/' + usuarioId,
        method: 'GET',
        dataType: 'JSON'
      });
    }
  };
}]);
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
'use strict';

angular.module('reservas').factory('Reservaslista', ["$http", function ($http) {

  // Public API
  return {
    getReservas: function (espacioId) {
      return $http({
        url: '/reservasEspacio/' + espacioId,
        method: 'GET',
        dataType: 'JSON'
      });
    }
  };
}]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function($stateProvider) {
    // Users state routing
    $stateProvider.
    state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).
    state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).
    state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).
    state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).
    state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).
    state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).
    state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).
    state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).
    state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    // Si el usuario ya esra logeado en el sistema entonces lo llevamos a supagina principal
    if ($scope.authentication.user.tipoUser === 1) { $location.path('/'); }
    if ($scope.authentication.user.tipoUser === 2) { $location.path('homeStudent'); }

    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // verificamos que tipo de usuario es
        if ($scope.authentication.user.tipoUser === '2') {
          $location.path('/homeStudent');
        } else {
        // And redirect to the index page
          $location.path('/');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // revisamos si es un estudiante o un administrador
        if ($scope.authentication.user.tipoUser === '2') {
          console.log('Entro en el si');
          $location.path('/homeStudent');
        } else {
        // And redirect to the index page
          console.log('Entro en el no');
          $location.path('/');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
  ]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);