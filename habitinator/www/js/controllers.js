angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $cordovaGeolocation, $ionicPlatform) {

	$ionicPlatform.ready(function() {

		// -------------------------------------------
		// Geolocation plugin
	 	var posOptions = {timeout: 10000, enableHighAccuracy: false};

		$cordovaGeolocation
	    .getCurrentPosition(posOptions)
	    .then(function (position) {
	      	var lat  = position.coords.latitude
	      	var long = position.coords.longitude

	      	// This console logs a geolocation
	      	console.log('Latitude: ', lat, ' Longitude: ', long)
	    }, function(err) {
	      	// error
	    });


	  	var watchOptions = {
	    	frequency : 1000,
	    	timeout : 3000,
	    	enableHighAccuracy: false // may cause errors if true
	  	};

	  	var watch = $cordovaGeolocation.watchPosition(watchOptions);
	  	watch.then(
	 	null,
		function(err) {
	  		// error
		},
		function(position) {
	  		var lat  = position.coords.latitude
	  		var long = position.coords.longitude
		});

		watch.clearWatch();


		// --------------------------
		$scope.getPhoto = function() {
		    Camera.getPicture()
		    .then(function(imageURI) {
		      	console.log(imageURI);
		    }, function(err) {
		      	console.log(err);
		    });
	  	};

	  	$scope.getPhoto();


	}, false);	
})

.controller('DashCtrl', function($scope) {


})

.controller('ChatsCtrl', function($scope, Chats) {

  	$scope.chats = Chats.all();
  	$scope.remove = function(chat) {
    	Chats.remove(chat);
  	}

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {

  	$scope.chat = Chats.get($stateParams.chatId);

})

.controller('AccountCtrl', function($scope) {

  	$scope.settings = {
    	enableFriends: true
  	};

});
