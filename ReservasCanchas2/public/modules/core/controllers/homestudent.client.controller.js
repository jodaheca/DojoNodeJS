'use strict';
angular.module('core').controller('HomeStudentclientcontroller',
    function ($scope, $location, Reservafechaestudiante, Authentication) {

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
  });