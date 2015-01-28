'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Reserva = mongoose.model('Reserva'),
	_ = require('lodash');

/**
 * Create a Reserva
 */
exports.create = function(req, res) {
	var reserva = new Reserva(req.body);
	reserva.user = req.user;

	reserva.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reserva);
		}
	});
};

/**
 * Show the current Reserva
 */
exports.read = function(req, res) {
	res.jsonp(req.reserva);
};

/**
 * Update a Reserva
 */
exports.update = function(req, res) {
	var reserva = req.reserva ;

	reserva = _.extend(reserva , req.body);

	reserva.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reserva);
		}
	});
};

/**
 * Delete an Reserva
 */
exports.delete = function(req, res) {
	var reserva = req.reserva ;

	reserva.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reserva);
		}
	});
};

/**
 * List of Reservas
 */
exports.list = function(req, res) { Reserva.find().sort('-created').populate('user', 'displayName').exec(function(err, reservas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reservas);
		}
	});
};

/**
 * List of Reservas de un espacio especifico.
 */
exports.listPorEspacio = function(req, res) {
	console.log('llega al server');
	console.log('Request: ', req.params);
	// req.parameter.espacio;
	var espacioId = 2;
	//var espacioId = req.espacio;
	console.log('llega al server');
 Reserva.find({numero_espacio: espacioId}).sort('-created').populate('user', 'displayName').exec(function(err, reservas) {
		
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reservas);
		}
	});
};

/**
 * Reserva middleware
 */
exports.reservaByID = function(req, res, next, id) { Reserva.findById(id).populate('user', 'displayName').exec(function(err, reserva) {
		if (err) return next(err);
		if (! reserva) return next(new Error('Failed to load Reserva ' + id));
		req.reserva = reserva ;
		next();
	});
};

/**
 * Reserva authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.reserva.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};