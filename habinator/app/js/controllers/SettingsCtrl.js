app.controller('SettingsCtrl', function ($scope, HabitService, $ionicPopup){
	// Clears the database
	$scope.reset = function() {
		var title 		= "Oh no!";
		var subtitle 	= "Are you sure you don\'t want to keep track of your habits anymore?";

		var myPopup = $ionicPopup.show({
			title: title,
			subTitle: subtitle,
			buttons: [
				{
					text: 'CANCEL',
					type: 'button-clear accent-color'
				},
	  			{
			        text: 'RESET',
			        type: 'button-clear accent-color',
			        onTap: function(e) {

			        	HabitService.clear();
	    			}
	  			}
			]
		});
		
	}	
});
