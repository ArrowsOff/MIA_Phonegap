var app = angular.module('starter', ['ionic', 'ngLodash', 'ngResource', 'LocalForageModule', 'angularMoment']);

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

            angular.forEach(data, function(habit) {
                if(habit.completed.length > 1) {
                    if(moment().format("MMM Do YY") === habit.completed[habit.completed.length - 1].date) {
                        if($rootScope.succeeded.indexOf(habit._id) == -1) {
                            $rootScope.succeeded.push(habit._id);
                        }
                    }
                }       
            });
        });
    });
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

  // .state('app.habit', {
  //   url: '/dashboard/:id',
  //   views: {
  //       'menuContent': {
  //         templateUrl: 'templates/habit.html',
  //         controller: 'HabitCtrl'
  //       }
  //     }
    
  // })

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
		habit.dateStart = new Date();

		 $localForage.setItem(habit._id ,habit).then(function() {
		 	$rootScope.$broadcast('AddedHabit');
		 	defer.resolve('Succesfully added habit to database');
	    });

		 return defer.promise;
	};

	HabitService.clear = function() {
		$localForage.clear();
	}

	HabitService.getHabit = function(id) {
		lodash.findLastIndex(habits);

		return habits[id];
	};

	HabitService.complete = function(id) {
		requestHabits().then(function(data) {
			angular.forEach(data, function(obj) {
				if(id === obj) {
					$localForage.getItem(obj).then(function(data) {
						data.completed.push({ completed: true, date: moment().format("MMM Do YY") });

						$localForage.setItem(data._id, data).then(function() {
							$rootScope.$broadcast('FinishedHabit');
							$log.debug("Completed in database");
						})
					})
				}
			})
		});
	}

	HabitService.failed = function(id) {
		requestHabits().then(function(data) {
			angular.forEach(data, function(obj) {
				if(id === obj) {
					$log.debug(obj);

					$localForage.getItem(obj).then(function(data) {
						data.completed.push({ completed: false, date: moment().format("MMM Do YY") });

						$localForage.setItem(data._id, data).then(function() {
							$rootScope.$broadcast('FinishedHabit');
							$log.debug("Completed false in database");
						})
					})
				}
				
			})
		})
	}

	function makeId() {
		function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	return HabitService;

});
app.controller('AppCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicModal, $log, HabitService) {
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

	$scope.clear = function() {
		HabitService.clear();
	}

		// Clears the database
	$scope.reset = function() {
		HabitService.clear();
	}

	$rootScope.$on('FinishedHabit', function() {
		$log.log("Finished Habit");

		angular.forEach($rootScope.habits, function(habit) {

			if(habit.completed.length > 1) {
				if(moment().format("MMM Do YY") === habit.completed[habit.completed.length - 1].date) {
					if($rootScope.succeeded.indexOf(habit._id) == -1) {
						$rootScope.succeeded.push(habit._id);
					}
				}
			}

		})
	})

	$rootScope.$on('AddedHabit', function() {
		$log.log('Added Habit');

		HabitService.get().then(function(data) {
	        $rootScope.habits = data;
		});
	});

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

	$scope.isToday = function(dates) {
		if(!!dates) {

			$log.log(today());
			
			if(dates.hasOwnProperty(today())) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	$scope.streakcount = 2;

	$scope.completed = function(id) {
  		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			title: 'Hooray',
			subTitle: 'Good job, you\'re staying on track!',
			buttons: [
      			{
			        text: 'THANKS',
			        type: 'button-clear accent-color',
			        onTap: function(e) {
			        	$log.debug("Task", id, "completed");
          				HabitService.complete(id)
        			}
      			}
			]
  		});
	}

	$scope.failed = function(id) {
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			title: 'Too bad',
			subTitle: 'I\'m sure you will get it next time!',
			buttons: [
      			{
			        text: 'OK',
			        type: 'button-clear accent-color',
			        onTap: function(e) {
			        	$log.debug("Task", id, "failed");
          				HabitService.failed(id);
        			}
      			}
			]
  		});		
	}

	// $rootScope.succeeded = [];

	// $scope.isFinished = function(id) {		
	// 	angular.forEach($rootScope.habits, function(habit) {
	// 		if(habit._id === id) {
	// 			if(habit.completed.length > 1) {

	// 				if(moment().format("MMM Do YY") == habit.completed[habit.completed.length - 1].date) {
	// 					if($rootScope.succeeded.indexOf(habit._id) == -1) {
	// 						$rootScope.succeeded.push(habit._id);
	// 					}
						
						
	// 				}
	// 			}	
	// 		}			
	// 	})

	// 	if($rootScope.succeeded.indexOf(id) == -1) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
		
	// }

	


});

app.controller('HabitCtrl', function ($scope, HabitService){

});	

app.controller('LoginCtrl', function ($scope){

});
app.controller('ProfileCtrl', function ($scope){

});	

app.controller('RankingCtrl', function ($scope){
		
});

app.controller('SettingsCtrl', function ($scope){
		
});
