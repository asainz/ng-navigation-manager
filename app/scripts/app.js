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
      ],
      '/': [
        {
          route: 'about',
          logged: 'always'
        }
      ],
      'about': '/'
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        template: '<h1>This is the about page</h1>'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
