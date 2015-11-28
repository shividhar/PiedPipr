angular.module('starter.controllers', [])

.controller('ConfirmCtrl', ['$scope', '$state', function($scope, $state) {

}])

.controller('MyOrgCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {

  $scope.host = function() {
    $state.go('host');
  }

  $scope.join = function() {
    $state.go('join');
  }

}])

.controller('NewOrgCtrl', ['$scope', '$state', '$ionicPopup', '$rootScope', function($scope, $state, $ionicPopup, $rootScope) {

}])

.controller('AboutCtrl', ['$scope', '$state', '$rootScope', '$ionicPopup', function($scope, $state, $rootScope, $ionicPopup) {
  $scope.back = function () {
    $state.go('myorg');
  }

  $scope.done = function () {
    $state.go('confirm');
  }

}])

.controller('ListCtrl', ['$scope', '$state', '$rootScope', '$ionicPlatform', '$ionicPopup', function($scope, $state, $rootScope, $ionicPlatform, $ionicPopup) {

}])

.controller('SearchCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
  $scope.back = function () {
    $state.go('myorg');
  }

  $scope.done = function () {
    $state.go('confirm');
  }

}])

.controller('SplashCtrl', ['$scope', '$state', function($scope, $state) {

  // goes to Confirm page

  $scope.next = function () {
    $state.go('myorg');
  };

}]);
