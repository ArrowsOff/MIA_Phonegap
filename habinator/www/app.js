var app = angular.module('starter', ['ionic', 'ngLodash', 'ngResource', 'LocalForageModule', 'angularMoment', 'ngCordova']);

app.run(function($rootScope, $ionicPlatform, $log, HabitService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        // Getting all preloaded habits from database and set them global
        HabitService.get().then(function(data) {
            $rootScope.habits = data;
        });
    });
});

// Setup the filter
app.filter('dashboardReady', function($log) {
  // Create the return function and set the required parameter name to **input**
  return function(habits) {
    var out = [];

    var today = function() {
      var t = new Date().getDay();

      if(t == 1) { return "mon"; } 
      else if (t == 2) { return "tue";} 
      else if (t == 3) { return "wed"; } 
      else if (t == 4) { return "thu";} 
      else if (t == 5) { return "fri";} 
      else if (t == 6) { return "sat";} 
      else { return "sun"; }
    }

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(habits, function(habit) {
      var dates = habit.remembering;
      if(!!dates) {
        if(dates.hasOwnProperty(today())) {
          if(habit.completed.length > 1) {
            if(!habit.completed[habit.completed.length-1].date === moment().format('MMM Do YY')) {
              out.push(habit);
            }
          } else {
            out.push(habit);
          }
        }
      }
    });

    return out;
  }
});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(10);

  $stateProvider
  // setup an abstract state for the tabs directive
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  // Each tab has its own nav history stack:

  .state('app.dash', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('app.habits', {
    url: '/habits',
    views: {
      'menuContent': {
        templateUrl: 'templates/habits.html',
        controller: 'HabitCtrl'
      }
    }
  })

  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

  .state('app.ranking', {
    url: '/ranking',
    views: {
      'menuContent': {
        templateUrl: 'templates/ranking.html',
        controller: 'RankingCtrl'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');

});

app.controller('AppCtrl', function($scope, $rootScope, $cordovaLocalNotification, $ionicSideMenuDelegate, $ionicModal, $log,$cordovaOauth, $ionicPopup, $http, HabitService) {
	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
	};

	$scope.add = function(habit) {
		HabitService.add(habit, $scope.habits).then(function() {
			HabitService.get().then(function(data) {
		        $rootScope.habits = data;

		        if(data.length == 1) {
		        	$log.log('First habit added');
		        	addNotification('Congratulations', 'You have earned your first badge!');
		        }

		        HabitService.set($rootScope.habits);
			});
		});

		$scope.modal.hide();
	};	

	function addNotification(title, message) {
		$cordovaLocalNotification.schedule({
			id: "12345",
			date: moment(),
			message: message,
			title: title
		}).then(function() {
			$log.log("Notification was set");
		});
	}

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
							counter = counter - 5;
						}
					}
				});
			}
		});

		return counter;
	}

});
app.controller('DashCtrl', function($scope, $rootScope, $log, $ionicPopup, HabitService){

	var today = function() {
		var t = new Date().getDay();

		if(t == 1) { return "mon"; } 
		else if (t == 2) { return "tue";} 
		else if (t == 3) { return "wed"; } 
		else if (t == 4) { return "thu";} 
		else if (t == 5) { return "fri";} 
		else if (t == 6) { return "sat";} 
		else { return "sun"; }
	}

	$scope.rememberDay = function() {
		return moment().format("MMM Do")
	}

	$scope.isToday = function(dates) {
		if(!!dates) {			
			if(dates.hasOwnProperty(today())) {
				return true;
			}
		}
		return false;
	}

	$scope.finished = function(id, status) {
		var title 		= status=='complete' ? "Hooray" : "Too bad";
		var subtitle 	= status=='complete' ? "Good job, you\'re staying on track!" : "I\'m sure you will get it next time!";
		var text		= status=='complete' ? "THANKS" : "I WILL";

		var myPopup = $ionicPopup.show({
			title: title,
			subTitle: subtitle,
			buttons: [
	  			{
			        text: text,
			        type: 'button-clear accent-color',
			        onTap: function(e) {
			        	var first = false;
			        	$log.log("Task", id, status);
			        	angular.forEach($rootScope.habits, function(habit) {
			        		if(habit.completed.length == 1) {
			        			if(status == "complete" && id == habit._id) {
			        				first = true;
			        				$log.log("THIS IS THE FIRST SUCCESS", habit._id, id)
			        			}
			        		}
			        	})
	      				HabitService.finish(id, status)
	    			}
	  			}
			]
		});		
	}

	$scope.isFinished = function(dates) {
		if(dates.length > 1) {
			if(dates[dates.length-1].date == moment().format('MMM Do YY')) {
				return false;
			}
		}
		return true;
	}

	$rootScope.$on('FinishedHabit', function() {
		// $log.log('Completed habit')
		HabitService.get().then(function(data) {
	        $rootScope.habits = data;
		});
	})
});

app.controller('HabitCtrl', function ($scope, $rootScope, $log, $ionicPopup, HabitService){
	
	$scope.remove = function(id) {
		var title 		= "Oh no!";
		var subtitle 	= "Are you sure you don\'t want to keep track of your habit anymore?";

		var myPopup = $ionicPopup.show({
			title: title,
			subTitle: subtitle,
			buttons: [
				{
					text: 'CANCEL',
					type: 'button-clear accent-color'
				},
	  			{
			        text: "DELETE",
			        type: 'button-clear accent-color',
			        onTap: function(e) {
	      				HabitService.destroy(id).then(function() {
	      					HabitService.get().then(function(data){
								$rootScope.habits = data;
							})
	      				});
	    			}
	  			}
			]
		});	

		
	}

});	

app.controller('LoginCtrl', function ($scope){

});
app.controller('ProfileCtrl', function($scope, $rootScope, $log) {

	
});	

app.controller('RankingCtrl', function ($scope){
		
});

app.controller('SettingsCtrl', function ($scope, HabitService, $ionicPopup){
	// Clears the database
	$scope.reset = function() {
		var title 		= "Oh no!";
		var subtitle 	= "Are you sure you don\'t want to keep track of your habits anymore?";

		var myPopup = $ionicPopup.show({
			title: title,
			subTitle: subtitle,
			buttons: [
				{
					text: 'CANCEL',
					type: 'button-clear accent-color'
				},
	  			{
			        text: 'RESET',
			        type: 'button-clear accent-color',
			        onTap: function(e) {

			        	HabitService.clear();
	    			}
	  			}
			]
		});
		
	}	
});

app.service('HabitService', function(lodash, $rootScope, $q, $http, $localForage, $log) {

	var HabitService = this;

	var habits;

	function requestHabits() {
		var defer = $q.defer();

		$localForage.keys().then(function(res){
			defer.resolve(res);
		});

		return defer.promise;
	}

	HabitService.set = function(data){
		habits = data;
	};

	HabitService.get = function() {
		var defer = $q.defer();

		$log.log("Getting habits");

		requestHabits().then(function(res) {
			$localForage.getItem(res).then(function(data) {
				$log.log(data);
				habits = data;
				defer.resolve(habits);
			})
		}).catch(function(err) {
			$log.error(err);
		})

		return defer.promise;
	};

	HabitService.add = function(habit) {
		var defer = $q.defer();

		if (!!habits[0]) {
			habit.index = $rootScope.habits.length + 1;
		} else {
			habit.index = 0;
		}
		habit.completed = [false];
		habit._id = makeId();
		habit.streakcount = 0;
		habit.dateStart = new Date();

		 $localForage.setItem(habit._id ,habit).then(function() {
		 	$rootScope.$broadcast('AddedHabit');
		 	defer.resolve('Succesfully added habit to database');
	    });

		 return defer.promise;
	};

	HabitService.clear = function() {
		$localForage.clear();
		$rootScope.$broadcast('ClearedDB');
	}

	HabitService.getHabit = function(id) {
		lodash.findLastIndex(habits);

		return habits[id];
	};

	HabitService.destroy = function(id) {
		var defer = $q.defer(); 

		$localForage.getItem(id).then(function(data) {
			$localForage.removeItem(id).then(function(res) {
				defer.resolve('Succesfully removed item');
			})
		});

		return defer.promise;
	}

	HabitService.finish = function(id, status) {
		requestHabits().then(function(data) {
			angular.forEach(data, function(obj) {
				if(id === obj) {
					$localForage.getItem(obj).then(function(data) {
						if(status == "complete") {
							data.streakcount++;
							data.completed.push({ completed: true, date: moment().format("MMM Do YY") });
						} else {
							data.streakcount=0;
							data.completed.push({ completed: false, date: moment().format("MMM Do YY") });
						}
						

						$localForage.setItem(data._id, data).then(function() {
							$rootScope.$broadcast('FinishedHabit');
							if(status == "complete") {
								$log.log("Habit completed");	
							} else {
								$log.log("Habit completed");
							}
							
						})
					})
				}
			})
		});
	}

	function makeId() {
		function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	return HabitService;

});