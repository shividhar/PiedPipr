angular.module('piedpipr')

.controller('SplashController', SplashController);

function SplashController ($scope, $state) {

  $scope.turnup = function() {
    $state.go('turnup');
  };

}
