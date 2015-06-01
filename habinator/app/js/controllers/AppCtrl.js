app.controller('AppCtrl', function ($scope, $ionicSideMenuDelegate) {
	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
	};

});