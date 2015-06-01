app.controller('DashCtrl', function($scope, $ionicModal, $log, HabitService){

	$scope.openModal = function() {
		$log.info('Opening Habit Modal');
	    $scope.modal.show();
	};

	$scope.add = function(habit) {
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
