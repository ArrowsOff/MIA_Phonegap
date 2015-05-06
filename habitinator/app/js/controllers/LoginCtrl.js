angular.module('starter.controllers.LoginCtrl', [])
	.controller('LoginCtrl', ['$scope', '$state', '$ionicPopup', '$cordovaOauth', '$location', 'AuthService', 
	function ($scope, $state, $ionicPopup, $cordovaOauth, $location, AuthService){

		$scope.data = {

		};

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

	}]);