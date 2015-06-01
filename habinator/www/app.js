var app = angular.module('starter', ['ionic', 'ngLodash', 'ngResource', 'LocalForageModule']);

app.run(function($ionicPlatform) {
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

app.service('HabitService', function(lodash, $q, $http, $localForage) {

	var HabitService = this;

	var habits;

	function requestHabits() {
		var defer = $q.defer();

		var keys = $localForage.keys().then(function(res){
			defer.resolve(res);
		});

		return defer.promise;
	}

	HabitService.set = function(data){
		habits = data;
	};

	HabitService.get = function() {
		var defer = $q.defer();

		requestHabits().then(function(res){
			$localForage.getItem(res).then(function(data){
				habits = data;
				console.log(data);
				defer.resolve(habits);
			})
		})

		return defer.promise;
	};

	HabitService.add = function(habit) {
		var defer = $q.defer();

		var last;
		if (habits[0]) {
			habit.index = lodash.last(habits).index + 1;
		} else {
			habit.index = 0;
		}
		habit.completed = false;
		habit._id = makeId();
		habit.dateStart = new Date(); //moment();
		// // habit.dateEnd = moment();

		 $localForage.setItem(habit._id ,habit)
		 .then(function() {

		 	defer.resolve('Succesfully added habit to database')
	        // $localForage.getItem('habit')
	        // .then(function(data) {
	        //     // Refresh the view here!
	            
	        // });
	    });

		 return defer.promise;
	};

	HabitService.clear = function() {
		console.log('CLEAR DATABASE');
		$localForage.clear();
	}

	HabitService.getHabit = function(id) {

		console.log(habits, id)
		lodash.findLastIndex(habits);

		habit = habits[id];

		return habit;

	};

	function makeId() {
		function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	return HabitService;

});
app.controller('AppCtrl', function ($scope, $ionicSideMenuDelegate) {
	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
	};

});
app.controller('DashCtrl', function($scope, $ionicModal, $log, HabitService){

	$scope.openModal = function() {
		$log.info('Opening Habit Modal');
	    $scope.modal.show();
	};

	$scope.add = function(habit) {
		$log.debug(habit);
		$log.debug($scope.modal);
		HabitService.add(habit, $scope.habits).then(function(){
			HabitService.get().then(function(data){
				$scope.habits = data;
			});
		});

		$scope.modal.hide();
	};

	$scope.refresh = function() {
		HabitService.get()
		.then(function(data){
			$scope.habits = data;
		})
		.finally(function() {
       		// Stop the ion-refresher from spinning
       		$scope.$broadcast('scroll.refreshComplete');
     	});;
	}

	// Clears the database
	$scope.reset = function() {
		HabitService.clear();
	}

	// Open the Add a Habit modal.
	$ionicModal.fromTemplateUrl('templates/my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up',
	    focusFirstInput: true
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	// Get habits onload
	HabitService.get().then(function(data){
  		$scope.habits = data;

  		HabitService.set($scope.habits);
  	});
});

app.controller('HabitCtrl', function ($scope, HabitService){

	// Get habits onload
	HabitService.get().then(function(data){
  		$scope.habits = data;

  		HabitService.set($scope.habits);
  	});

});	

app.controller('LoginCtrl', function ($scope){

});
app.controller('ProfileCtrl', function ($scope){

});	

app.controller('RankingCtrl', function ($scope){
		
});

app.controller('SettingsCtrl', function ($scope){
		
});
