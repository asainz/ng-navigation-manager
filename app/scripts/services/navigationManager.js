(function(){

    'use strict';

    var navigationManagerModule = angular.module('navigationManagerModule', []);

    navigationManagerModule.provider('navigationManagerService', function(){
        var routes = {};

        // This methods takes the routes object set by the user and returns a normalized version of it.
        // It will add replace all missing values for the default version of it.
        // Default route object
        // "routeName": [
            // {
            //     route: "to-route-name", 
            //     logged: "always",
            //     ontTimeVisit: false
            // }
        // ]
        var normalizeRoutesObject = function(routes){
            var defaultRouteObject = {
                route: '',
                logged: 'always',
                oneTimeVisit: false
            };
            var normalizedRoutes = {};
            angular.forEach(routes, function(routesConfig, routeName){
                normalizedRoutes[ routeName ] = [];

                if( typeof routesConfig === 'string' ){
                    normalizedRoutes[ routeName ].push( angular.extend({}, defaultRouteObject, {route: routesConfig}) );
                }

                if( toString.call(routesConfig) === '[object Array]' ){
                    angular.forEach(routesConfig, function(routeConfig){
                        if( typeof routeConfig === 'string' ){
                            normalizedRoutes[ routeName ].push( angular.extend({}, defaultRouteObject, {route: routeConfig}) );
                        }else{
                            normalizedRoutes[ routeName ].push( angular.extend({}, defaultRouteObject, routeConfig) );
                        }
                    });
                }
            });
            return normalizedRoutes;
        };

        this.setRoutes = function(_routes){
            routes = normalizeRoutesObject(_routes);
            console.log('normalized', routes);
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