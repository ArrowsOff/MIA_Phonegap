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

	$rootScope.$on('AddedHabit', function() {
		$log.log('Added Habit');

		HabitService.get().then(function(data) {
	        $rootScope.habits = data;
		});
	});

});