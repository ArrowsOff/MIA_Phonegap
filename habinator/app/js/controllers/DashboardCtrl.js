app.controller('DashCtrl', function($scope, $log, HabitService){

	$scope.remindDate = new Date().getDay();

	$scope.streakcount = 156;

	$scope.completed = function(id) {
		$log.debug("Task", id, "is completed");
		HabitService.complete(id);
	}

	$scope.failed = function(id) {
		$log.debug("Task", id, "failed");
		HabitService.failed(id);
	}

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

	// Get habits onload
	HabitService.get().then(function(data){
  		$scope.habits = data;

  		HabitService.set($scope.habits);
  	});
});
