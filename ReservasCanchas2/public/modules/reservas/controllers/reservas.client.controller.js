'use strict';

// Reservas controller
angular.module('reservas').controller('ReservasController', function ($scope, $stateParams, $location, Authentication, Reservas, Reservaslista, Reservafechaestudiante, $modal, $log) {

  $scope.authentication = Authentication;
  //Funcion para abrir un nuevo modal para registrar una reserva por parte de un estudiante.

  $scope.registrarReserva = function (size, diaSemana) {
    // var dia = diaSemana;
    var codigoEspacio = $stateParams.espacioId;
    $scope.horarios = [
      {
        codigo: 14,
        valor: '14PM-15PM'
      },
      {
        codigo: 15,
        valor: '15PM-16PM'
      },
      {
        codigo: 16,
        valor: '16PM-17PM'
      },
      {
        codigo: 17,
        valor: '17PM-18PM'
      }
    ];
    $scope.reservo = [
      {
        yaReservo: 0
      }
    ];
   // $scope.reservo = 1;
    if (codigoEspacio > 3) {   // La reserva es para una cancha sintetica
      $scope.horarios = [
        {
          codigo: 8,
          valor: '8AM-9AM'
        },
        {
          codigo: 9,
          valor: '9AM-10AM'
        },
        {
          codigo: 10,
          valor: '10AM-11AM'
        },
        {
          codigo: 11,
          valor: '11AM-12M'
        },
        {
          codigo: 14,
          valor: '14PM-15PM'
        },
        {
          codigo: 15,
          valor: '15PM-16PM'
        },
        {
          codigo: 16,
          valor: '16PM-17PM'
        },
        {
          codigo: 17,
          valor: '17PM-18PM'
        }
      ];
      var fecha = new Date();
      // Dia de la semana;
      var dSemanaActual = fecha.getDay();

      if (diaSemana !== dSemanaActual) {
        alert('La reserva de la cancha de tenis se debe realizar el mismo dia que esta sera utilizada');
        //$location.path('/homeStudent');
        return;
      }
    }
    console.log('Dia semana', diaSemana);
    console.log('Horarios:', $scope.horarios);
    //Metodo en el cual se maneja el modal mediante el cual los estudiantes realizan las reservas
    var modalReservaEstudiante = $modal.open({
      templateUrl: 'modules/reservas/views/reserva-estudiante.client.view.html',
      controller: function ($scope, $modalInstance, horarios, reservo) {
        $scope.horarios = horarios;
        $scope.reservo = reservo;
        $scope.diaSemana = diaSemana;
        $scope.codigoEspacio = codigoEspacio;
        $scope.authentication = Authentication;

        $scope.salirReserva = function () {
          $modalInstance.close();
        };

        $scope.reservar = function (hora) {
          $scope.horaReserva = hora;
          var dt = new Date();
          // Dia de la semana;
          var dSemana = dt.getDay();
          if (codigoEspacio <= 3) {
            $scope.tipo_espacio = 'Cancha Sintetica';
          } else {
            $scope.tipo_espacio = 'Cancha de Tenis';
            console.log('Dia semana: ', dSemana);
            console.log('Dia semana: ', diaSemana);
          }

          var dMes = dt.getDate();
          //var month = dt.getMonth();
          //var year = dt.getFullYear();
          var agregarDias =  $scope.diaSemana - dSemana;
          // Configuracion de la fecha de acuerdo a lo que escogio el estudiante.
          dt.setDate(dMes + agregarDias);
          dt.setHours(0);
          dt.setMinutes(0);
          dt.setSeconds(0);
          dt.setMilliseconds(0);
          console.log('Fecha Reserva: ', dt);
          console.log('Codigo Espacio Seleccionado: ', $scope.codigoEspacio);
          console.log('Espacio Seleccionado: ', $scope.tipo_espacio);
          console.log('Dia de la Semana Seleccionado : ', $scope.diaSemana);
          console.log('Esta es la hora seleccionada', $scope.horaReserva);
          console.log('Usuario: ', $scope.authentication.user.identificacion);

          // Creamos una variable para almacenar el objeto de la reserva que vamos a guardar
          var reserva = new Reservas({
            persona: $scope.authentication.user.identificacion,
            tipo_espacio: $scope.tipo_espacio,
            numero_espacio: $scope.codigoEspacio,
            fecha : dt,
            hora : $scope.horaReserva
          });
          // Guardo la reserva en db
          reserva.$save(function (response) {
            $scope.salirReserva();
            $location.path('reservas/' + response._id);
          },
            function (errorResponse) {
              $scope.error = errorResponse.data.message;
            });
        };
      },
      size: size,
      resolve: {
        horarios: function () {
          return $scope.horarios;
        },
        reservo: function () {
          return $scope.reservo;
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
    $scope.authentication = Authentication;
    console.log('Tipo Usuario: ', $scope.authentication.user.tipoUser);
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
        $scope.authentication = Authentication;
        console.log('Tipo Usuario: ', $scope.authentication.user.tipoUser);
        if ($scope.authentication.user.tipoUser == 2) { //Si es estudiante va a la pantalla principal
          alert('Reserva Eliminada Correctamente.');
          $location.path('homeStudent');
         // $location.path('/auth/signout');
        } else if ($scope.authentication.user.tipoUser == 1) { // Admnistrador va a ver las otras reservas
          $location.path('reservas');
        }
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
  //Redirecionr al Principal del estudiante.

  $scope.principalEstudiante = function () {
    $location.path('/homeStudent');
  };

   //Redirecionr al Principal del admin.

  $scope.principalAdmin = function () {
    $location.path('/');
  };

  //Redirecionr a lalista de los estudiantes.
  $scope.listarReservas = function () {
    $location.path('/reservas');
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
  };

  // Find existing Reserva
  $scope.findOne = function () {
    $scope.reserva = Reservas.get({
      reservaId: $stateParams.reservaId
    });
    //var rese = $scope.reserva;
    //console.log('Reserva: ', rese);
    //$scope.diaReserva =  rese.getDate();
  };
 //Metodo que regresa las reservas que tenga una persona en un rango de fechas
  $scope.verificarDisponibilidad = function (espacioId) {

    $scope.authentication = Authentication;
    var codigoEspacio = espacioId;
    console.log('El codigo del espacion es:', codigoEspacio);
    var dt = new Date();
    // Dia de la semana;
    var dSemana = dt.getDay();
    var dMes = dt.getDate();
    console.log('Dia semana:', dSemana);

    var fechaInicial = new Date();
    var fechaFinal = new Date();
    fechaInicial.setDate(dMes);
    fechaInicial.setHours(0);
    fechaInicial.setMinutes(0);
    fechaInicial.setSeconds(0);
    fechaFinal.setMilliseconds(0);
    fechaFinal.setDate(dMes + 4);
    fechaFinal.setHours(0);
    fechaFinal.setMinutes(0);
    fechaFinal.setSeconds(0);
    fechaFinal.setMilliseconds(0);

    console.log('fecha Inicial: ', fechaInicial);
    console.log('fecha Final: ', fechaFinal);

        // verificamos si esta consultando reservas para una Cancha sintetica        
    if (codigoEspacio <= 3) {

      // Si el dia en que se hace la consulta es diferente al lunes entones no lo dejamos pasar
      if (dSemana == 5) {
        console.log('Recuerde que la reserva de las canchas Sinteticas se debe realizar los lunes de cada semana.');
        alert('La reserva de las canchas sintéticas se realizan los lunes de cada semana.');
        $location.path('/homeStudent');
        return;
      }
      //Metodo que consume el servicio web que recibe las fechas y la cedula de la persona y retorna una lista con las reservas
      Reservafechaestudiante.getReservaUsuario(fechaInicial, fechaFinal, $scope.authentication.user.identificacion)
        .success(function (res) {
          console.log('PETICION:', res);
          var reservas = res;
          if (reservas.length !== 0) {
            var reser = reservas[0];
            console.log(reser);
            console.log('Señor Usuario ya usted tiene una reserva para esta semana.');
            alert('Señor Usuario  usted ya tiene una reserva para esta semana.');
            $location.path('reservas/' + reser._id);
            return;

          }
          $location.path('modelo/' + espacioId);
          return;
        })
          .error(function (err) {
          console.log('Error: ', err);
        });
    } else { // Va a reservas una cancha De tenis
      //Metodo que consume el servicio web que recibe las fechas y la cedula de la persona y retorna una lista con las reservas
      Reservafechaestudiante.getReservaUsuario(fechaInicial, fechaFinal, $scope.authentication.user.identificacion)
        .success(function (res) {
          console.log('PETICION:', res);
          var reservas = res;
          if (reservas.length !== 0) {
            var reser = reservas[0];
            console.log(reser);
            console.log('Señor Usuario ya usted tiene una reserva para esta semana.');
            alert('Señor Usuario  usted ya tiene una reserva para esta semana.');
            $location.path('reservas/' + reser._id);
            return;

          }
          $location.path('modelo/' + espacioId);
          return;
        })
          .error(function (err) {
          console.log('Error: ', err);
        });
    }
  };

  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  };

  $scope.toggleMin = function () {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
});