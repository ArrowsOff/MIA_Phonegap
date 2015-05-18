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