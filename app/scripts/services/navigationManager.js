(function(){

    'use strict';

    var navigationManagerModule = angular.module('navigationManagerModule', []);

    navigationManagerModule.provider('navigationManagerService', function(){
        var routes = {};

        var normalizeRoutesObject = function(routes){
            return routes;
        };

        this.setRoutes = function(_routes){
            routes = normalizeRoutesObject(_routes);
        };

        this.$get = ['$location', function($location){
            var checkValidChangeRoute = function(){
                return true;
            };

            var navigate = function(route, options){
                if( options.force || checkValidChangeRoute(route) ){
                    $location.path(route);
                }
            };

            return {
                navigate: navigate
            };

        }];

    });

}).call(this);