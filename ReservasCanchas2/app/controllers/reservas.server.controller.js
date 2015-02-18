'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Reserva = mongoose.model('Reserva'),
  _ = require('lodash');
var nodemailer = require('nodemailer'); //Paquete para el envio de mensajes a los usuario que reservan

/**
 * Create a Reserva
 */
exports.create = function (req, res) {
  var reserva = new Reserva(req.body);
  console.log("Peticion: ", req);
  console.log("Reserva", reserva);
  reserva.user = req.user;
  console.log("Correo ", req.user.email);
  var mensaje = "Mediante este correo le notificamos que su reserva se realizó exitosamente.\n\n\n\n";
  mensaje = mensaje.concat("Codigo de reserva: ");
  mensaje = mensaje.concat(reserva._id);
  mensaje = mensaje.concat("\nIdentificación de quien reserva: ", reserva.persona);
  mensaje = mensaje.concat("\nTipo de Espacio Deportivo: ", reserva.tipo_espacio);
  mensaje = mensaje.concat("\nNúmero de Espacio Deportivo: ", reserva.numero_espacio);
  mensaje = mensaje.concat("\nFecha de reserva: ", reserva.fecha);
  mensaje = mensaje.concat("\nHora de Reserva: ", reserva.hora);
  mensaje = mensaje.concat("\n\n\n\nConserve e imprima esta constancia para verificar su reserva al momento de utilizar el espacio Deportivo ");
  console.log("Mensaje", mensaje);
  reserva.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(reserva);
    var smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'reservasudea@gmail.com',
        pass: 'r3s3rvasud3a'
      }
    });

    // var mailOptions = {
    //   from: 'Reservas Deportivas <reservasudea@gmail.com', // sender address
    //   to: 'joaquincolossus@gmail.com', // list of receivers
    //   subject: 'Informe de la reserva realizada', // Subject line
    //   text: 'Mediante este correo le notificamos que su reserva se realizo exitosamente.' // plaintext body
    // };
    var mailOptions = {
      from: 'Reservas Deportivas <reservasudea@gmail.com', // sender address
      to: req.user.email, // list of receivers
      subject: 'Informe de la reserva realizada', // Subject line
      text: mensaje // plaintext body
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log('Error enviando correo', error);
      } else {
        console.log('Respuesta al enviar el correo', response);
        //res.redirect('/');
      }
    });

  });
};

/**
 * Show the current Reserva
 */
exports.read = function (req, res) {
  res.jsonp(req.reserva);
};

/**
 * Update a Reserva
 */
exports.update = function (req, res) {
  var reserva = req.reserva;

  reserva = _.extend(reserva, req.body);

  reserva.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(reserva);
  });
};

/**
 * Delete an Reserva
 */
exports.delete = function (req, res) {
  var reserva = req.reserva;

  reserva.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(reserva);

  });
};

/**
 * List of Reservas
 */
exports.list = function (req, res) { Reserva.find().sort('-created').populate('user', 'displayName').exec(function (err, reservas) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
  res.jsonp(reservas);

});
  };

/**
 * List of Reservas de un espacio especifico.
 */
exports.listPorEspacio = function (req, res) {
  console.log('llega al server');
  console.log('Request: ', req.params);
  var espacioId = req.params.espacioId;
  //var espacioId = 2;
  //var espacioId = req.espacio;
  console.log('llega al server');
  Reserva.find({numero_espacio: espacioId}).sort('-created').populate('user', 'displayName').exec(function (err, reservas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(reservas);
  });
};

/**
 * Lista las reservas que tiene un usuario en unn rango de fechas.
 */
exports.reservaFechaUsuario = function (req, res) {
  console.log('llega al server Metodo reservaFechaUsuario');
  console.log('Request: ', req.params);
  var fechaInicial = req.params.fechaInicial;
  var fechaFinal = req.params.fechaFinal;
  console.log('Fecha Inicial: ', fechaInicial);
  console.log('Fecha Final: ', fechaFinal);
  var identificacion = req.params.idUsuario;
  console.log('identificacion: ', identificacion);

  // esta consulta devuelve las reservas en un rango de fechas de un usuario del sistema.
  Reserva.find({fecha: { $gte : fechaInicial, $lte : fechaFinal }, persona : identificacion}).sort('-created').populate('user', 'displayName').exec(function (err, reservas) {
    if (err) {
      console.log('Ocurrio un error en el servidor: ', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    console.log('Respuesta de la consula: ', reservas);
    res.jsonp(reservas);

  });
};

/**
 * Reserva middleware
 */
exports.reservaByID = function (req, res, next, id) { Reserva.findById(id).populate('user', 'displayName').exec(function (err, reserva) {
  if (err) {return next(err); }
  if (!reserva) { return next(new Error('Failed to load Reserva ' + id)); }
  req.reserva = reserva;
  next();
});
  };

/**
 * Reserva authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.reserva.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
