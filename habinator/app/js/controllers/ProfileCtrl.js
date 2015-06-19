app.controller('ProfileCtrl', function($scope, $rootScope, $log) {

	$scope.badges = function(badge) {
		if(badge == 'welcome' && window.localStorage.firstBadge) {
			$log.log('welcome badge true');
			return true;
		}
		if(badge == 'success' && window.localStorage.successBadge) {
			$log.log('success badge true');
			return true;
		}
	}
});	
