app.controller('ProfileCtrl', function ($scope, $http, $log, $cordovaOauth) {

	$scope.login = function() {
        $cordovaOauth.facebook("902314686547924", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            window.localStorage.accessToken = result.access_token;
            alert("Succesfully logged in!");

            $scope.load();
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            $log.log(error);
        });
    };



    $scope.load = function() {
    	if(window.localStorage.hasOwnProperty("accessToken") === true) {
	    	$http.get("https://graph.facebook.com/v2.3/me", 
	        	{ params: { access_token: window.localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }})
			.then(function(result) {
				$log.log(result);
				$scope.loggedIn = true;
	            $scope.profileData = result.data;
	        }, function(error) {
	            alert("There was a problem getting your profile.  Check the logs for details.");
	            console.log(error);
	        });
		} else {
			alert("Not logged in!")
		}
    }

});	
