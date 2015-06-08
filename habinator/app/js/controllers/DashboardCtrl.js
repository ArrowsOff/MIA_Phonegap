app.controller('DashCtrl', function($scope, $log, $ionicPopup, HabitService){

	$scope.remindDate = new Date().getDay();

	$scope.streakcount = 156;

	$scope.completed = function(id) {
  		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			title: 'Hooray',
			subTitle: 'Good job, you\'re staying on track!',
			buttons: [
      			// { 
      			// 	text: 'CANCEL', 
      			// 	type: 'button-clear accent-color' 
      			// },
      			{
			        text: 'THANKS',
			        type: 'button-clear accent-color',
			        onTap: function(e) {
			        	$log.debug("Task", id, "failed");
          				// HabitService.complete(id);
        			}
      			}
			]
  		});


		$log.debug("Task", id, "is completed");
		// HabitService.complete(id);
	}

	$scope.failed = function(id) {
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			title: 'Too bad',
			subTitle: 'I\'m sure you will get it next time!',
			buttons: [
      			// { 
      			// 	text: 'CANCEL', 
      			// 	type: 'button-clear accent-color' 
      			// },
      			{
			        text: 'OK',
			        type: 'button-clear accent-color',
			        onTap: function(e) {
			        	$log.debug("Task", id, "failed");
          				// HabitService.failed(id);
        			}
      			}
			]
  		});		
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
