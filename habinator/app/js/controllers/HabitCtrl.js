app.controller('HabitCtrl', function ($scope, HabitService){

	// Get habits onload
	HabitService.get().then(function(data){
  		$scope.habits = data;

  		HabitService.set($scope.habits);
  	});

});	
