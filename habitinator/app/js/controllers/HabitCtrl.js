app.controller('HabitCtrl', function ($scope, $stateParams, HabitService){
	
	$scope.habit = HabitService.getHabit($stateParams.id);

});	
