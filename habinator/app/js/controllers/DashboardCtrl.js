app.controller('DashCtrl', function($scope, $log, $ionicPopup, HabitService){

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


});
