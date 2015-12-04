angular.module('piedpipr')

.controller('JoinController', JoinController);

function JoinController ($scope, $state) {

  $scope.turnup = function() {
    $state.go('turnup');
  };

}
