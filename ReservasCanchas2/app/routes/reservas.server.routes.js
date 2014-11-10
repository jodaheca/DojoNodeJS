'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var reservas = require('../../app/controllers/reservas');

	// Reservas Routes
	app.route('/reservas')
		.get(reservas.list)
		.post(users.requiresLogin, reservas.create);

	app.route('/reservas/:reservaId')
		.get(reservas.read)
		.put(users.requiresLogin, reservas.hasAuthorization, reservas.update)
		.delete(users.requiresLogin, reservas.hasAuthorization, reservas.delete);

	// Finish by binding the Reserva middleware
	app.param('reservaId', reservas.reservaByID);
};