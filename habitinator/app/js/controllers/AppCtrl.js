angular.module('starter.controllers.AppCtrl', [])
	.controller('AppCtrl', ['$scope', '$state', '$ionicPopup', 'LocationService', 'AuthService', 'AUTH_EVENTS', function ($scope, $state, $ionicPopup, LocationService, AuthService, AUTH_EVENTS) {

		// This will return a location object with latitude and longitude
		LocationService.getPosition();

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

		$scope.isAuthenticated = function() {
			return AuthService.isAuthenticated();
		};
		
	}]);