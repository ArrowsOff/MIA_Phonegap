var app = angular.module('starter', ['ionic', 'ngLodash', 'ngResource', 'LocalForageModule', 'angularMoment', 'ngCordova']);

app.run(function($rootScope, $ionicPlatform, $log, HabitService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        // Getting all preloaded habits from database and set them global
        HabitService.get().then(function(data) {
            $rootScope.habits = data;
        });
    });
});

// Setup the filter
app.filter('dashboardReady', function($log) {
  // Create the return function and set the required parameter name to **input**
  return function(habits) {
    var out = [];

    var today = function() {
      var t = new Date().getDay();

      if(t == 1) { return "mon"; } 
      else if (t == 2) { return "tue";} 
      else if (t == 3) { return "wed"; } 
      else if (t == 4) { return "thu";} 
      else if (t == 5) { return "fri";} 
      else if (t == 6) { return "sat";} 
      else { return "sun"; }
    }

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(habits, function(habit) {
      var dates = habit.remembering;
      if(!!dates) {
        if(dates.hasOwnProperty(today())) {
          if(habit.completed.length > 1) {
            if(!habit.completed[habit.completed.length-1].date === moment().format('MMM Do YY')) {
              out.push(habit);
            }
          } else {
            out.push(habit);
          }
        }
      }
    });

    return out;
  }
});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(10);

  $stateProvider
  // setup an abstract state for the tabs directive
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  // Each tab has its own nav history stack:

  .state('app.dash', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('app.habits', {
    url: '/habits',
    views: {
      'menuContent': {
        templateUrl: 'templates/habits.html',
        controller: 'HabitCtrl'
      }
    }
  })

  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

  .state('app.ranking', {
    url: '/ranking',
    views: {
      'menuContent': {
        templateUrl: 'templates/ranking.html',
        controller: 'RankingCtrl'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');

});
