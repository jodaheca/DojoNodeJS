'use strict';

angular.module('reservas').factory('Reservafechaestudiante', function ($http) {

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
});