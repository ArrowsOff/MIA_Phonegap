var app = angular.module('starter', ['ionic', 'ngLodash']);

app.run(function($ionicPlatform) {
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
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dashboard',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.habit', {
    url: '/dashboard/:id',
    views: {
        'tab-dash': {
          templateUrl: 'templates/habit.html',
          controller: 'HabitCtrl'
        }
      }
    
  })

  .state('tab.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

  .state('tab.ranking', {
    url: '/ranking',
    views: {
      'tab-ranking': {
        templateUrl: 'templates/ranking.html',
        controller: 'RankingCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dashboard');

});

app.controller('AppCtrl', function ($scope, $state, $ionicPopup, $ionicSideMenuDelegate, LocationService, AuthService) {

	// This will return a location object with latitude and longitude
	var location = LocationService.getPosition();

	location.then(function(result){
		console.log('lat:', result.lat, 'long:', result.long);
	}, function(err){
		console.log(err);
	});

	$scope.username = AuthService.username();

	$scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
		var alertPopup = $ionicPopup.alert({
			title: 'Unauthorized',
			template: 'You are not allowed to access this resource'
		});
	});

	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {

		AuthService.logout();
		$state.go('login');

		var alertPopup = $ionicPopup.alert({
			title: 'Session lost!',
			template: 'Sorry, you have to login again'
		});
	});

	$scope.setCurrentUsername = function(name) {
		$scope.username = name;
	};

	$scope.logout = function() {
		AuthService.logout();
    	$state.go('login');
	};

	$scope.isLoggedIn = function() {
		return AuthService.isAuthenticated();
	};

	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
		};

});
app.controller('DashCtrl', function ($scope, $ionicModal, HabitService){
	$scope.habits = {
		0: {
			id: '0',
			name: "habit 1",
			date: 'Start date',
			remembering: {
				mon: false,
				tue: false,
				wed: true,
				thu: false,
				fri: false,
				sat: true,
				sun: false
			},
			rememberTime: '18:00',
			type: ''
		},
		1: {
			id: '1',
			name: "habit 2",
			date: 'Start date',
			remembering: {
				mon: true,
				tue: false,
				wed: true,
				thu: false,
				fri: false,
				sat: true,
				sun: false
			},
			rememberTime: '17:00',
			type: ''
		}
	};

	$scope.openModal = function() {
	    $scope.modal.show();
	};

	$scope.add = function(habit) {
		HabitService.add(habit);

		$scope.closeModal();
	};

	$ionicModal.fromTemplateUrl('templates/my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$scope.closeModal = function() {
	    $scope.modal.hide();
  	};


  	HabitService.set($scope.habits);
});

app.controller('HabitCtrl', function ($scope, $stateParams, HabitService){
	
	$scope.habit = HabitService.getHabit($stateParams.id);

});	

app.controller('LoginCtrl', function ($scope, $state, $ionicPopup, $cordovaOauth, $location, AuthService){
	$scope.data = {	};

	$scope.login = function(data) {
		AuthService.login(false, data.username, data.password).then(function(){

			$state.go('main.dash', {}, {reload: true});
			$scope.setCurrentUsername(data.username);

		}, function(err) {
			var alertPopup = $ionicPopup.alert({
				title: 'Login failed',
				template: 'Please check your credentials'
			});
		});
	};

	$scope.facebookLogin = function() {
		AuthService.login(true).then(function(){
			$state.go('main.dash', {}, {reload: true});
			$scope.setCurrentUsername(data.username);
		}, function(err) {
			alert("There was a problem singing in!");
			console.log(err);
		});
	};
});
app.controller('ProfileCtrl', function ($scope){
	// $scope.getProfile = function() {
	// 	AuthService.getProfile()
	// 	.then(function(result){

	// 		$scope.profileData = result;

	// 	}, function(err) {

	// 		console.log('Error: ', err);

	// 	});	
	// };
});	

app.controller('RankingCtrl', function ($scope){
		
});

app.controller('SettingsCtrl', function ($scope){
		
});

app.service('AuthService', function ($q, $http, $cordovaOauth) {

    var AuthService = this;

    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;
    var facebook;
 
    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        
        if (token) {
            useCredentials(token);
        }
    }
 
    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }
 
    function useCredentials(token) {
        username = token.split('.')[0];
        isAuthenticated = true;
        authToken = token;
 
        // if (username == 'admin') {
        //     role = USER_ROLES.admin;
        // }
        // if (username == 'user') {
        //     role = USER_ROLES.public;
        // } else {
        //     role = USER_ROLES.public;
        // }
 
        // Set the token as header for your requests!
        $http.defaults.headers.common['X-Auth-Token'] = token;
    }
 
    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['X-Auth-Token'] = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    AuthService.login = function() {
        var defer = $q.defer();

        $cordovaOauth.facebook('902314686547924', ['email', 'id']).then(function(result){

            storeUserCredentials(result.access_token);
            facebook = true;
            defer.resolve('Login success');

        }, function(err) {
            defer.reject('Login Failed');
        });

        return defer.promise;
    };

    AuthService.getProfile = function() {
        var defer = $q.defer();

        if(facebook) {
            $http.get('https://graph.facebook.com/v2.2/me', { 
                    params: { 
                        access_token: window.localStorage.getItem(LOCAL_TOKEN_KEY),
                        fields: "id,name,gender,location,website,picture,relationship_status", 
                        format: "json" 
                    }
            }).success(function(response) {

                defer.resolve(response);

            }).error(function(err, status){

                console.log("Something went wrong", err, status);
                defer.reject(err);

            });
        } else {
            alert('Not logged in with Facebook');
        }

        return defer.promise;
    };

    AuthService.isFacebook = function() {
        return facebook;
    };
 
    AuthService.logout = function() {
        destroyUserCredentials();
    };
 
    AuthService.isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };

    AuthService.isAuthenticated = function() {
        return isAuthenticated;
    };

    AuthService.username = function() {
        return username;
    };

    AuthService.role = function() {
        return role;
    };
 
    loadUserCredentials();
 
    return AuthService;
});

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function (response) {
            // $rootScope.$broadcast({
            //     401: AUTH_EVENTS.notAuthenticated,
            //     403: AUTH_EVENTS.notAuthorized
            // }[response.status], response);
            // return $q.reject(response);
        }
    };
});

// app.config(function ($httpProvider) {
//     $httpProvider.interceptors.push('AuthInterceptor');
// });
app.service('HabitService', function(lodash) {

	var HabitService = this;

	var habits = {};

	HabitService.set = function(data){
		habits = data;
	};

	HabitService.get = function() {
		return habits;
	};

	HabitService.add = function(habit) {

		// Put habit in json
		console.log(habit);

	};

	HabitService.getHabit = function(id) {

		habit = habits[id];

		return habit;

	};

	return HabitService;

});
app.factory('LocationService', function ($q){

    var location = null;

    var getPosition = function(refresh) {
        
        var deferred = $q.defer();
        
        if( location === null || refresh ) {
        
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var long = position.coords.latitude;

                location = { 'lat' : lat, 'long' : long };

                deferred.resolve(location);

            }, function(error) {
                console.log('Got error!', error);
                location = null;
                
                deferred.reject('Failed to get Latitude and Longitude');
            });
            
        } else {
            deferred.resolve(location);
        }
        
        return deferred.promise;

    };      
    
    return {
        getPosition : getPosition
    };
});
app.value('version', '0.0.1');
app.directive('appVersion', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
});