app.controller('AppCtrl', function($scope, $rootScope, $cordovaLocalNotification, $ionicSideMenuDelegate, $ionicModal, $log,$cordovaOauth, $ionicPopup, $http, HabitService) {
	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
	};

	$scope.add = function(habit) {
		HabitService.add(habit, $scope.habits).then(function() {
			HabitService.get().then(function(data) {
		        $rootScope.habits = data;

		        if(data.length == 1) {
		        	if($scope.loggedIn) {
						var myPopup = $ionicPopup.show({
							title: "Congratulations",
							subTitle: "You have just received your first badge, check your profile to view it!",
							buttons: [
					  			{
							        text: 'AWESOME',
							        type: 'button-clear accent-color',
							        onTap: function(e) {
							        	window.localStorage.firstBadge = true;
							        }
					  			}
							]
						});
		        	}
		        	// addNotification('Congratulations', 'You have earned your first badge!');
		        }

		        HabitService.set($rootScope.habits);
			});
		});

		$scope.modal.hide();
		$scope.modal.remove();
	};	

	// function addNotification(title, message) {
	// 	$log.log(cordova.plugins.notification.local, window.plugin.notification.local.add)
	// 	$cordovaLocalNotification.schedule({
	// 		id: "12345",
	// 		date: moment(),
	// 		message: message,
	// 		title: title
	// 	}).then(function() {
	// 		$log.log("Notification was set");
	// 	});
	// }

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
	    // Open the Add a Habit modal.
		$ionicModal.fromTemplateUrl('templates/my-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up',
		    focusFirstInput: true
		}).then(function(modal) {
		    $scope.modal = modal;
		    $scope.modal.show();
		});
	};

	

	// If habit added, refresh scope
	$rootScope.$on('AddedHabit', function() {
		HabitService.get().then(function(data) {
	        $rootScope.habits = data;
		});
	});

	// If database is cleared, refresh scope
	$rootScope.$on('ClearedDB', function() {
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
    
    $scope.calculateScore = function() {
		var counter = 0;

		angular.forEach($rootScope.habits, function(habit) {
			if(habit.completed.length > 1) {
				angular.forEach(habit.completed, function(completed) {
					if(!!completed) {
						if(completed.completed) {
							counter = counter + 5;
						} else {
							if(!counter < 5) {
								counter = counter - 5;	
							} else {
								counter = 0;
							}							
						}
					}
				});
			}
		});

		return counter;
	}

});