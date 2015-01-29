'use strict';

// Reservas controller
angular.module('reservas').controller('ReservasController', function ($scope, $stateParams, $location, Authentication, Reservas, Reservaslista, $modal, $log) {

  $scope.authentication = Authentication;
  //Funcion para abrir un nuevo modal para registrar una reserva por parte de un estudiante.

  $scope.registrarReserva = function (size, diaSemana) {
    var dia = diaSemana;
    var codigoEspacio = $stateParams.espacioId;
    console.log('Espacio a Reservar: ', codigoEspacio);
    console.log('Dia de la Semana: ', dia);

    $scope.horarios = [
      {
        codigo: 1,
        valor: '2PM-3PM'
      },
      {
        codigo: 2,
        valor: '3PM-4PM'
      },
      {
        codigo: 3,
        valor: '4PM-5PM'
      },
      {
        codigo: 4,
        valor: '5PM-6PM'
      }
    ];

    var modalReservaEstudiante = $modal.open({
      templateUrl: 'modules/reservas/views/reserva-estudiante.client.view.html',
      controller: function ($scope, $modalInstance, horarios) {
        $scope.horarios = horarios;
        //$scope.horarios = [];
        $scope.horario = {
          horario: $scope.horarios[0]
        };
        $scope.salirReserva = function () {
          $modalInstance.close();
        };
        $scope.reservar = function (hora) {
          $scope.horario = hora;
        };
      },
      size: size,
      resolve: {
        horarios: function () {
          return $scope.horarios;
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
        $location.path('reservas');
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
    // $http.get('/reservasEspacio/',{espacio : espacioId}).
    //           success(function(data, status, headers, config) {
    //             $scope.reservas = data;

    //           }).
    //           error(function(data, status, headers, config) {

    //           });

  };
      // genera la tabla con las reservas de la semana
      // $scope.genera_tabla = function() {
      //   // Obtener la referencia del elemento body
      //   var body = document.getElementsByTagName("body")[0];     
      //   // Crea un elemento <table> y un elemento <tbody>
      //   var tabla   = document.createElement("table");
      //   var tblBody = document.createElement("tbody");      
      //   // Crea las celdas
      //   for (var i = 0; i < 2; i++) {
      //     // Crea las hileras de la tabla
      //     var hilera = document.createElement("tr");     
      //     for (var j = 0; j < 2; j++) {
      //       // Crea un elemento <td> y un nodo de texto, haz que el nodo de
      //       // texto sea el contenido de <td>, ubica el elemento <td> al final
      //       // de la hilera de la tabla
      //       var celda = document.createElement("td");
      //       var textoCelda = document.createTextNode("celda en la hilera "+i+", columna "+j);
      //       celda.appendChild(textoCelda);
      //       hilera.appendChild(celda);
      //     }    
      //     // agrega la hilera al final de la tabla (al final del elemento tblbody)
      //     tblBody.appendChild(hilera);
      //   }    
      //   // posiciona el <tbody> debajo del elemento <table>
      //   tabla.appendChild(tblBody);
      //   // appends <table> into <body>
      //   body.appendChild(tabla);
      //   // modifica el atributo "border" de la tabla y lo fija a "2";
      //   tabla.setAttribute("border", "2");
      // };
  // Find existing Reserva
  $scope.findOne = function () {
    $scope.reserva = Reservas.get({
      reservaId: $stateParams.reservaId
    });
  };
});