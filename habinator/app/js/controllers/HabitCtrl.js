app.controller('HabitCtrl', function ($scope, $rootScope, $log, $ionicPopup, HabitService){
	
	$scope.remove = function(id) {
		var title 		= "Oh no!";
		var subtitle 	= "Are you sure you don\'t want to keep track of your habit anymore?";

		var myPopup = $ionicPopup.show({
			title: title,
			subTitle: subtitle,
			buttons: [
				{
					text: 'CANCEL',
					type: 'button-clear accent-color'
				},
	  			{
			        text: "DELETE",
			        type: 'button-clear accent-color',
			        onTap: function(e) {
	      				HabitService.destroy(id).then(function() {
	      					HabitService.get().then(function(data){
								$rootScope.habits = data;
							})
	      				});
	    			}
	  			}
			]
		});	

		
	}

});	
