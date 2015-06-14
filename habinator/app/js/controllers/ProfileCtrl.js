app.controller('ProfileCtrl', function ($scope, $log, $cordovaOauth) {

	$scope.login = function() {
        $cordovaOauth.facebook("902314686547924", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            window.localStorage.accessToken = result.access_token;
            alert("Succesfully logged in!");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            $log.log(error);
        });
    };

});	
