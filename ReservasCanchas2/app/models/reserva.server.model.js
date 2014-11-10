'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Reserva Schema
 */
var ReservaSchema = new Schema({
	persona: {
		type: String,
		default: '',
		required: 'Ingrese cedula de quien realiza la Reserva',
		trim: true
	},
	tipo_espacio: {
		type: String,
		default: '',
		required: 'Ingrese el tipo de espacion de la reserva',
		trim: true
	},
	numero_espacio: {
		type: String,
		default: '',
		required: 'Ingrese el numero del espacio',
		trim: true
	},
	fecha: {
		type: Date,
		default: '',
		required: 'Ingrese la fecha de la reserva',
		trim: true
	},
	hora: {
		type: String,
		default: '',
		required: 'Ingrese la Hora de la reserva',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Reserva', ReservaSchema);