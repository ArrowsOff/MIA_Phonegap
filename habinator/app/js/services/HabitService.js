app.service('HabitService', function(lodash, $q, $http, $localForage) {

	var HabitService = this;

	var habits;

	function requestHabits() {
		var defer = $q.defer();

		var keys = $localForage.keys().then(function(res){
			defer.resolve(res);
		});

		return defer.promise;
	}

	HabitService.set = function(data){
		habits = data;
	};

	HabitService.get = function() {
		var defer = $q.defer();

		requestHabits().then(function(res){
			$localForage.getItem(res).then(function(data){
				habits = data;
				console.log(data);
				defer.resolve(habits);
			})
		})

		return defer.promise;
	};

	HabitService.add = function(habit) {
		var defer = $q.defer();

		var last;
		if (habits[0]) {
			habit.index = lodash.last(habits).index + 1;
		} else {
			habit.index = 0;
		}
		habit.completed = false;
		habit._id = makeId();
		habit.dateStart = new Date(); //moment();
		// // habit.dateEnd = moment();

		 $localForage.setItem(habit._id ,habit)
		 .then(function() {

		 	defer.resolve('Succesfully added habit to database')
	        // $localForage.getItem('habit')
	        // .then(function(data) {
	        //     // Refresh the view here!
	            
	        // });
	    });

		 return defer.promise;
	};

	HabitService.clear = function() {
		console.log('CLEAR DATABASE');
		$localForage.clear();
	}

	HabitService.getHabit = function(id) {

		console.log(habits, id)
		lodash.findLastIndex(habits);

		habit = habits[id];

		return habit;

	};

	function makeId() {
		function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	return HabitService;

});