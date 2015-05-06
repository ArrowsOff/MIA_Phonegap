angular.module('starter.services.LocationService', [])
	.factory('LocationService', function ($q){

	    var location = null;

	    var getPosition = function(refresh) {
	        
	        var deferred = $q.defer();
	        
	        if( location === null || refresh ) {
	        
	            navigator.geolocation.getCurrentPosition(function(position) {
	                var lat = position.coords.latitude;
	                var long = position.coords.latitude;

	                location = { 'lat' : lat, 'long' : long };

	                deferred.resolve(location);

	            }, function(error) {
	                console.log('Got error!', error);
	                location = null;
	                
	                deferred.reject('Failed to get Latitude and Longitude');
	            });
	            
	        } else {
	            deferred.resolve(location);
	        }
	        
	        return deferred.promise;

	    };      
	    
	    return {
	        getPosition : getPosition
	    };
	});