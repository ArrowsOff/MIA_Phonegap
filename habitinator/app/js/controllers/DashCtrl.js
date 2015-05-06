angular.module('starter.controllers.DashCtrl', [])
	.controller('DashCtrl', ['$scope', '$state', '$http', '$ionicPopup', '$cordovaCamera', '$cordovaFile', '$cordovaGeolocation', 'AuthService', 
	function ($scope, $state, $http, $ionicPopup, $cordovaCamera, $cordovaFile, $cordovaGeolocation, AuthService){
		
		// Authentication
		// ---------------------------------------------

		$scope.performValidRequest = function() {
			$http.get('http://localhost:8100/valid').then(
	      	function (result) {
	        	$scope.response = result;
	      	});
		};

		$scope.performUnauthorizedRequest = function() {
			$http.get('http://localhost:8100/notauthorized')
			.then(function (result) {
	        	// No result here..
	      	}, function(err) {
	        	$scope.response = err;
	      	});
		};

		$scope.performInvalidRequest = function() {
			$http.get('http://localhost:8100/notauthenticated')
			.then(function(result){
				
			}, function(err) {
				$scope.response = err;
			});
		};

		// Camera
		// ---------------------------------------------
		$scope.images = [];

		$scope.addImage = function() {
			// 2
			var options = {
				destinationType : 	Camera.DestinationType.FILE_URI,
				sourceType : 		Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
				allowEdit : 		false,
				encodingType: 		Camera.EncodingType.JPEG,
				popoverOptions: 	CameraPopoverOptions,
			};

			$cordovaCamera.getPicture(options).then(function(imageData) {

				onImageSuccess(imageData);

				function onImageSuccess(fileURI) {
					createFileEntry(fileURI);
				}

				function createFileEntry(fileURI) {
					window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
				}

				function copyFile(fileEntry) {
					var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
					var newName = makeid() + name;

					window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
						fileEntry.copyTo(
							fileSystem2,
							newName,
							onCopySuccess,
							fail
						);
					}, fail);
				}

				function onCopySuccess(entry) {
					$scope.$apply(function () {
						console.log('Pushing image into array ', entry);
						$scope.images.push(entry.nativeURL);
					});
				}

				function fail(error) {
					console.log("fail: " + error.code);
				}

				function makeid() {
					var text = "";
					var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

					for (var i=0; i < 5; i++) {
						text += possible.charAt(Math.floor(Math.random() * possible.length));
					}
					return text;
				}

			}, function(err) {
				console.log(err);
			});
		};

		$scope.urlForImage = function(imageName) {
			console.log('Get path for: ', imageName);

			var name = imageName.substr(imageName.lastIndexOf('/') + 1);
			var trueOrigin = cordova.file.dataDirectory + name;

			return trueOrigin;
		};


		$scope.init = function() {

			// AuthService.getProfile()
			// .then(function(result){

			// 	$scope.profileData = result;
			// 	console.log(result);

			// }, function(err) {

			// 	alert('Error: ', err);

			// });

		};
	}]);
