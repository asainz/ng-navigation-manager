'use strict';

angular.module('navigationManagerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'navigationManagerModule'
])
  .config(function ($routeProvider, navigationManagerServiceProvider) {
    navigationManagerServiceProvider.setRoutes({
      'list': [
        'item',
        { route: 'signin', logged: false },
        { route: 'help', logged: 'always', oneTimeVisit: true },
        { route: 'buy', logged: true}
      ]
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function(navigationManagerService){
    console.log('navigationManagerService ===>', navigationManagerService);
  });
