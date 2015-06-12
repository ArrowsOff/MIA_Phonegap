app.service('HabitService', function(lodash, $rootScope, $q, $http, $localForage, $log) {

	var HabitService = this;

	var habits;

	function requestHabits() {
		var defer = $q.defer();

		$localForage.keys().then(function(res){
			defer.resolve(res);
		});

		return defer.promise;
	}

	HabitService.set = function(data){
		habits = data;
	};

	HabitService.get = function() {
		var defer = $q.defer();

		$log.log("Getting habits");

		requestHabits().then(function(res) {
			$localForage.getItem(res).then(function(data) {
				$log.log(data);
				habits = data;
				defer.resolve(habits);
			})
		}).catch(function(err) {
			$log.error(err);
		})

		return defer.promise;
	};

	HabitService.add = function(habit) {
		var defer = $q.defer();

		if (!!habits[0]) {
			habit.index = $rootScope.habits.length + 1;
		} else {
			habit.index = 0;
		}
		habit.completed = [false];
		habit._id = makeId();
		habit.dateStart = new Date();

		 $localForage.setItem(habit._id ,habit).then(function() {
		 	$rootScope.$broadcast('AddedHabit');
		 	defer.resolve('Succesfully added habit to database');
	    });

		 return defer.promise;
	};

	HabitService.clear = function() {
		$localForage.clear();
	}

	HabitService.getHabit = function(id) {
		lodash.findLastIndex(habits);

		return habits[id];
	};

	HabitService.finish = function(id, status) {
		requestHabits().then(function(data) {
			angular.forEach(data, function(obj) {
				if(id === obj) {
					$localForage.getItem(obj).then(function(data) {
						if(status == "complete") {
							data.completed.push({ completed: true, date: moment().format("MMM Do YY") });
						} else {
							data.completed.push({ completed: false, date: moment().format("MMM Do YY") });
						}
						

						$localForage.setItem(data._id, data).then(function() {
							$rootScope.$broadcast('FinishedHabit');
							if(status == "complete") {
								$log.log("Habit completed");	
							} else {
								$log.log("Habit completed");
							}
							
						})
					})
				}
			})
		});
	}

	function makeId() {
		function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	return HabitService;

});