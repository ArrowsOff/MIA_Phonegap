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
			        	// angular.forEach($rootScope.habits, function(habit) {
			        	// 	if(habit.completed.length == 1) {
			        	// 		if(status == "complete" && id == habit._id) {
			        	// 			first = true;
			        	// 			$log.log("THIS IS THE FIRST SUCCESS", habit._id, id)
			        	// 		}
			        	// 	}
			        	// })
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
		HabitService.get().then(function(data) {
	        $rootScope.habits = data;
		});
	})
});
