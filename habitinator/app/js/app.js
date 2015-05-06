// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic', 
    
    'starter.controllers.AppCtrl',
    'starter.controllers.LoginCtrl',
    'starter.controllers.DashCtrl', 
    'starter.controllers.ProfileCtrl', 

    'starter.constants', 

    'starter.services',
    'starter.services.LocationService',
    'starter.services.AuthenticationService',

    'starter.directives.version',

    'ngCordova'
    //'ngMockE2E',
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

    });
})

.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', function ($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })

        .state('main', {
            url: '/',
            abstract: true,
            templateUrl: 'templates/main.html'
        })

        .state('main.dash', {
            url: 'main/dash',
            views: {
                'dash-tab': {
                    templateUrl: 'templates/dashboard.html',
                    controller: 'DashCtrl'
                }
            }
        })

        .state('main.public', {
            url: 'main/public',
            views: {
                'public-tab': {
                    templateUrl: 'templates/public.html'
                }
            }
        })

        .state('main.admin', {
            url: 'main/admin',
            views: {
                'admin-tab': {
                    templateUrl: 'templates/admin.html'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        })

        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
        });

    $urlRouterProvider.otherwise('/main/dash');
}])

.run(['$rootScope', '$state', 'AuthService', 'AUTH_EVENTS', function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

        if ('data' in next && 'authorizedRoles' in next.data) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                $state.go($state.current, {}, {reload: true});
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }

        if (!AuthService.isAuthenticated()) {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        }

    });
}]);

// .run(['$httpBackend', function ($httpBackend){
//     $httpBackend.whenGET('http://localhost:8100/valid')
//         .respond({message: 'this is a valid response'});

//     $httpBackend.whenGET('http://localhost:8100/notauthenticated')
//     .respond(401, {message: 'Not Authenticated'});

//     $httpBackend.whenGET('http://localhost:8100/notauthorized')
//     .respond(403, {message: 'Not Authorized'});

//     $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
// }]);