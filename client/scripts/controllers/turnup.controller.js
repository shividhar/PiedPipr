angular.module('piedpipr')

.controller('TurnUpController', TurnUpController);

function TurnUpController ($scope, $state) {

  function join() {
    $state.go('join');
  }

  function host() {
    $state.go('host');
  }

  $scope.join = join;

  $scope.host = host;

}
