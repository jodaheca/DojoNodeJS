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