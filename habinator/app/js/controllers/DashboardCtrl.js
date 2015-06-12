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

	$scope.finished = function(id, status) {

		var title 		= status=='complete' ? "Hooray" : "Too bad";
		var subtitle 	= status=='complete' ? "Good job, you\'re staying on track!" : "I\'m sure you will get it next time!";
		var text		= status=='complete' ? "THANKS" : "OK";

		var myPopup = $ionicPopup.show({
			title: title,
			subTitle: subtitle,
			buttons: [
	  			{
			        text: text,
			        type: 'button-clear accent-color',
			        onTap: function(e) {
			        	$log.log("Task", id, status);
	      				HabitService.finish(id, status)
	    			}
	  			}
			]
		});		
	}

	$scope.failed = function(id) {
		// An elaborate, custom popup
				
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
