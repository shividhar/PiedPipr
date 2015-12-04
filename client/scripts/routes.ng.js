angular.module('piedpipr')

.config(config);

function config($stateProvider, $urlRouterProvider) {

  $stateProvider

  $stateProvider

    .state('home', {
        url: '/',
        templateUrl: 'client/templates/splash.html',
        controller: 'SplashController'
    })

    .state('turnup', {
        url: '/turnup',
        templateUrl: 'client/templates/turnup.html',
        controller: 'TurnUpController'
    })

    .state('join', {
        url: '/join',
        templateUrl: 'client/templates/join.html',
        controller: 'JoinController'
    })

    .state('host', {
        url: '/host',
        templateUrl: 'client/templates/host.html',
        controller: 'HostController'
    });

  $urlRouterProvider.otherwise('/');
}
