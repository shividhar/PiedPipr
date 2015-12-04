angular.module('piedpipr')

.controller('HostController', HostController);

function HostController ($scope, $state) {

  function join() {
    $state.go('join');
  }

  function host() {
    $state.go('host');
  }

  $scope.join = join;

  $scope.host = host;

}
