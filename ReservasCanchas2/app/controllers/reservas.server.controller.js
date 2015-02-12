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
exports.create = function (req, res) {
  var reserva = new Reserva(req.body);
  reserva.user = req.user;

  // create reusable transporter object using SMTP transport
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'jdavidhc94@gmail.com',
                    pass: '94030909725jdhc'
                }
            });

            // NB! No need to recreate the transporter object. You can use
            // the same transporter object for all e-mails

            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: 'Reservas Deportivas ✔ <foo@blurdybloop.com>', // sender address
                to: 'joaquincolossus@gmail.com', // list of receivers
                subject: 'Prueba ✔', // Subject line
                text: 'Prueba men ✔', // plaintext body
                html: '<b>Hello world ✔</b>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });



  

  reserva.save(function (err) {
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
    } else {
      res.jsonp(reserva);
    }
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
    } else {
      res.jsonp(reserva);
    }
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
  } else {
    res.jsonp(reservas);
  }
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
    } else {
      res.jsonp(reservas);
    }
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
    } else {
      console.log('Respuesta de la consula: ', reservas);
      res.jsonp(reservas);
    }
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