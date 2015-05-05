angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, LocationService, $state, AuthService, AUTH_EVENTS, $ionicPopup) {

	// This will log the latitude and longitude
	LocationService.getLatLong();

	$scope.username = AuthService.username();

	$scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
		var alertPopup = $ionicPopup.alert({
			title: 'Unauthorized',
			template: 'You are not allowed to access this resource'
		})
	})

	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {

		AuthService.logout();
		$state.go('login');

		var alertPopup = $ionicPopup.alert({
			title: 'Session lost!',
			template: 'Sorry, you have to login again'
		})
	})

	$scope.setCurrentUsername = function(name) {

		$scope.username = name;

	}

})

.controller('LoginCtrl', function ($scope, $state, $ionicPopup, AuthService){

	$scope.data = {

	}

	$scope.login = function(data) {

		AuthService.login(data.username, data.password)
		.then(function(authenticated){

			$state.go('main.dash', {}, {reload: true});
			$scope.setCurrentUsername(data.username);

		}, function(err) {
			var alertPopup = $ionicPopup.alert({
				title: 'Login failed',
				template: 'Please check your credentials'
			})
		})
	}


})

.controller('DashCtrl', function ($scope, $state, $ionicPopup, AuthService, $http){
	
	$scope.logout = function() {

		AuthService.logout();
    	$state.go('login');

	}

	$scope.performValidRequest = function() {
		$http.get('http://localhost:8100/valid').then(
      	function (result) {
        	$scope.response = result;
      	});
	}

	$scope.performUnauthorizedRequest = function() {
		$http.get('http://localhost:8100/notauthorized')
		.then(function (result) {
        	// No result here..
      	}, function(err) {
        	$scope.response = err;
      	});
	}

	$scope.performInvalidRequest = function() {
		$http.get('http://localhost:8100/notauthenticated')
		.then(function(result){
			
		}, function(err) {
			$scope.response = err;
		})
	}

})