'use strict';

angular.module('reservas').factory('Reservaslista', function ($http) {

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
});