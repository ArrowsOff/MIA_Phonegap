app.controller('AppCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicModal, $log,$cordovaOauth, $ionicPopup, $http, HabitService) {
	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
	};

	$scope.add = function(habit) {
		$log.debug(habit);

		HabitService.add(habit, $scope.habits).then(function() {
			HabitService.get().then(function(data) {
		        $rootScope.habits = data;

		        HabitService.set($rootScope.habits);
			});
		});

		$scope.modal.hide();
	};	

	$scope.refresh = function() {
		HabitService.get().then(function(data){
			$rootScope.habits = data;
			$log.log(data);
		})
		.finally(function() {
			$log.log('finished refreshing')
       		// Stop the ion-refresher from spinning
       		$scope.$broadcast('scroll.refreshComplete');
     	});;
	}

	$scope.openModal = function() {
		$log.info('Opening Habit Modal');
	    $scope.modal.show();
	};

	// Open the Add a Habit modal.
	$ionicModal.fromTemplateUrl('templates/my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up',
	    focusFirstInput: true
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$rootScope.$on('AddedHabit', function() {
		$log.log('Added Habit');

		HabitService.get().then(function(data) {
	        $rootScope.habits = data;
		});
	});

	// Login via Facebook
	$scope.login = function() {
        $cordovaOauth.facebook("902314686547924", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            window.localStorage.accessToken = result.access_token;
            $scope.load();
        }, function(error) {
            $log.error("There was a problem signing in!  See the console for logs");
            $log.error(error);
        });
    };

    // Preload information from facebook if logged in
    $scope.load = function() {
    	if(window.localStorage.hasOwnProperty("accessToken") === true) {
	    	$http.get("https://graph.facebook.com/v2.3/me", 
	        	{ params: { access_token: window.localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }})
			.then(function(result) {
				$log.log(result);
				$scope.loggedIn = true;
	            $scope.profileData = result.data;
	        }, function(error) {
	            $log.error("There was a problem getting your profile.  Check the logs for details.");
	            $log.error(error);
	        });
		} else {
			$log.log("Not logged in!");
		}
    }

    $scope.logout = function() {
		var title 		= "Log out";
		var subtitle 	= "Do you want to break our connection?";

		var myPopup = $ionicPopup.show({
			title: title,
			subTitle: subtitle,
			buttons: [
				{
					text: 'CANCEL',
					type: 'button-clear accent-color'
				},
	  			{
			        text: 'LOGOUT',
			        type: 'button-clear accent-color',
			        onTap: function(e) {
			        	window.localStorage.accessToken = undefined;
						$scope.loggedIn = false;
						$log.log("Succesfull logout");
	    			}
	  			}
			]
		});
    }

});