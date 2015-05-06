angular.module('starter.controllers.ProfileCtrl', [])
	.controller('ProfileCtrl', ['$scope', 'AuthService', function ($scope, AuthService){

		$scope.getProfile = function() {
			AuthService.getProfile()
			.then(function(result){

				$scope.profileData = result;

			}, function(err) {

				console.log('Error: ', err);

			});	
		};

	}]);	
