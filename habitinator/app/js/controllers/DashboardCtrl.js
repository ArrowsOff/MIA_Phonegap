app.controller('DashCtrl', function ($scope, $ionicModal, HabitService){
	$scope.habits = {
		0: {
			id: '0',
			name: "habit 1",
			date: 'Start date',
			remembering: {
				mon: false,
				tue: false,
				wed: true,
				thu: false,
				fri: false,
				sat: true,
				sun: false
			},
			rememberTime: '18:00',
			type: ''
		},
		1: {
			id: '1',
			name: "habit 2",
			date: 'Start date',
			remembering: {
				mon: true,
				tue: false,
				wed: true,
				thu: false,
				fri: false,
				sat: true,
				sun: false
			},
			rememberTime: '17:00',
			type: ''
		}
	};

	$scope.openModal = function() {
	    $scope.modal.show();
	};

	$scope.add = function(habit) {
		HabitService.add(habit);

		$scope.closeModal();
	};

	$ionicModal.fromTemplateUrl('templates/my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$scope.closeModal = function() {
	    $scope.modal.hide();
  	};


  	HabitService.set($scope.habits);
});
