app.service('HabitService', function(lodash) {

	var HabitService = this;

	var habits = {};

	HabitService.set = function(data){
		habits = data;
	};

	HabitService.get = function() {
		return habits;
	};

	HabitService.add = function(habit) {

		// Put habit in json
		console.log(habit);

	};

	HabitService.getHabit = function(id) {

		habit = habits[id];

		return habit;

	};

	return HabitService;

});