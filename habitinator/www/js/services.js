angular.module('starter.services', [])

.value('version', '0.0.1')

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('LocationService', ['$q', function($q){

    var latLong = null;
    
    var getLatLong = function(refresh) {
        
        var deferred = $q.defer();
        
        if( latLong === null || refresh ) {
        
            console.log('Calculating latitude and longitude');
            navigator.geolocation.getCurrentPosition(function(pos) {
                latLong =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude } 
                console.log(latLong);
                
                deferred.resolve(latLong);
            }, function(error) {
                console.log('Got error!', error);
                latLong = null
                
                deferred.reject('Failed to Get Latitude and Longitude')
            });
            
        }  else {
            deferred.resolve(latLong);
        }
        
        return deferred.promise;

    };      
    
    return {
        getLatLong : getLatLong
    }
}])

.service('serviceName', function($http, $q){
    
    var deferred = $q.defer();

    $http.get('').then(function(data){

        deferred.resolve(data);

    })

    this.get = function() {

        return deffered.promise;

    }

})