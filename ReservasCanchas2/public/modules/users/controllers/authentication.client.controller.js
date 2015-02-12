'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    // Si el usuario ya esra logeado en el sistema entonces lo llevamos a supagina principal
    if ($scope.authentication.user.tipoUser === 1) { $location.path('/'); }
    if ($scope.authentication.user.tipoUser === 2) { $location.path('homeStudent'); }

    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // verificamos que tipo de usuario es
        if ($scope.authentication.user.tipoUser === '2') {
          $location.path('/homeStudent');
        } else {
        // And redirect to the index page
          $location.path('/');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // revisamos si es un estudiante o un administrador
        if ($scope.authentication.user.tipoUser === '2') {
          console.log('Entro en el si');
          $location.path('/homeStudent');
        } else {
        // And redirect to the index page
          console.log('Entro en el no');
          $location.path('/');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
  ]);