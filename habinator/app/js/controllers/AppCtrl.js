app.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $log, HabitService) {
	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
	};

	$scope.add = function(habit) {
		$log.debug(habit);

		HabitService.add(habit, $scope.habits).then(function(){
			HabitService.get().then(function(data){
				$scope.habits = data;
			});
		});

		$scope.modal.hide();
	};

	$scope.openModal = function() {
		$log.info('Opening Habit Modal');
	    $scope.modal.show();
	};
	// Open the Add a Habit modal.
	$ionicModal.fromTemplateUrl('templates/my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up',
	    focusFirstInput: true
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$scope.clear = function() {
		HabitService.clear();
	}

});