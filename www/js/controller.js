angular.module('starter.controllers', [])

.controller('ConfirmCtrl', ['$scope', '$state', 'VideosService', function($scope, $state, VideosService) {

      init();

      $scope.list = VideosService.getUpcoming();

      function init() {
        $scope.youtube = VideosService.getYoutube();
        $scope.results = VideosService.getResults();
        $scope.upcoming = VideosService.getUpcoming();
        $scope.history = VideosService.getHistory();
        $scope.playlist = true;
      }

      $scope.launch = function (id, title) {
        VideosService.launchPlayer(id, title);
        VideosService.archiveVideo(id, title);
        VideosService.deleteVideo($scope.upcoming, id);
        $log.info('Launched id:' + id + ' and title:' + title);
      };

      $scope.queue = function (id, title) {
        VideosService.queueVideo(id, title);
        VideosService.deleteVideo($scope.history, id);
        $log.info('Queued id:' + id + ' and title:' + title);
      };

      $scope.delete = function (list, id) {
        VideosService.deleteVideo(list, id);
      };

      $scope.search = function () {
        $http.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: 'AIzaSyC9suQc7Hv_gWeOlo2z5AP3kxoxrBkSmR0',
            type: 'video',
            maxResults: '8',
            part: 'id,snippet',
            fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
            q: this.query
          }
        })
        .success( function (data) {
          VideosService.listResults(data);
          $log.info(data);
        })
        .error( function () {
          $log.info('Search error');
        });
      }

      $scope.tabulate = function (state) {
        $scope.playlist = state;
      }

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
