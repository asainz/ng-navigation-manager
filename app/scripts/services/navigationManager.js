(function(){

    'use strict';

    var navigationManagerModule = angular.module('navigationManagerModule', []);

    navigationManagerModule.provider('navigationManagerService', function(){
        var routes = {};
        var currentRoute;
        var oldRoute;
        // var routesCounter = [];
        var userLogged = false;
        var navigationTriggeredByBackButton = true;

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
        };

        this.$get = ['$location', '$rootScope', function($location, $rootScope){
            // This method will take care of reseting everything that needs to be reset after every route change
            var prepareManagerForANewRouteChange = function(){
                navigationTriggeredByBackButton = true;
            };

            //route change validation occurs if several steps
            // 1) If there isn't an old route, the change will be valid
            // 2) The current route has to be defined in the routes config object
            // 3) The new route is one of the valid route destinations of the current route.
            // 4) The user logged status  is the same as the defined in the route config.
            var checkValidChangeRoute = function(newRoute){
                var validNewRoute = false;
                var destinationRoute = {};

                // (1)
                if( !oldRoute && !currentRoute ){
                    return true;
                }

                var currentRouteConfig = routes[currentRoute];

                // (2)
                if( !currentRouteConfig ){
                    console.log('route ' + currentRoute + ' is not defined.');
                    return false;
                }

                angular.forEach(currentRouteConfig, function(destRoute){
                    // (3)
                    if( destRoute.route === newRoute ){
                        validNewRoute = true;
                        destinationRoute = destRoute;
                    }
                });
                if( !validNewRoute ){
                    console.log(currentRoute + ' to ' + newRoute + ' is not a valid change.');
                    return false;
                }

                // (4)
                validNewRoute = false;
                if( destinationRoute.logged === 'always' || destinationRoute.logged === userLogged){
                    validNewRoute = true;
                }
                if( !validNewRoute ){
                    console.log(currentRoute + ' to ' + newRoute + ' is not a valid change.');
                    return false;
                }

                return true;
            };

            // This methods takes care of making the location change itself if it's a valid one.
            // By setting navigationTriggeredByBackButton to false, the manager knows that this route change
            // was trigger by the user clicking in a ap button and not the back button of the device/browser
            // The options parameter contains these options:
                // force: bypasses the checks and forces the navigation (useful for edge cases)
            var navigate = function(newRoute, options){
                if( options.force || checkValidChangeRoute(newRoute) ){
                    navigationTriggeredByBackButton = false;

                    oldRoute = currentRoute;
                    currentRoute = newRoute;
                    $location.path(newRoute);
                }
            };

            // Set the user status (logged or not logged) so the manager can determine the validity of each route change
            // according to the user being logged or not.
            var setUserLoggedStatus = function(status){
                userLogged = !!status;
            };

            // If there's a location change event, but the navigationTriggeredByBackButton is not false, it means that 
            // the event was triggered by the back button of the device/browser, since the navigate method would set that flag to false.
            $rootScope.$on('$locationChangeStart', function(e, newRoute){
                if( navigationTriggeredByBackButton ){
                    if( !checkValidChangeRoute(newRoute) ){
                        e.preventDefault();
                    }else{
                        oldRoute = currentRoute;
                        currentRoute = newRoute;
                    }
                }
            });

            // After every success location change reset everything, so the manager can work on the future location change.
            $rootScope.$on('$locationChangeSuccess', function(){
                prepareManagerForANewRouteChange();
            });

            return {
                navigate: navigate,
                setUserLoggedStatus: setUserLoggedStatus
            };

        }];

    });

}).call(this);