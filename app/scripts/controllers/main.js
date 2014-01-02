'use strict';

angular.module('navigationManagerApp')
  .controller('MainCtrl', function ($scope, navigationManagerService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.navigate = navigationManagerService.navigate;
  });
