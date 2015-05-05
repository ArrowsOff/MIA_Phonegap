angular.module('starter.services', [])

.value('version', '0.0.1')

.factory('LocationService', function ($q){

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
})

.service('AuthService', function ($q, $http, USER_ROLES) {

    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;
 
    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        
        if (token) {
            useCredentials(token);
        }

        console.log('loadUserCredentials')
    }
 
    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);

        console.log('storeUserCredentials')
    }
 
    function useCredentials(token) {
        username = token.split('.')[0];
        isAuthenticated = true;
        authToken = token;
 
        if (username == 'admin') {
            role = USER_ROLES.admin
        }
        if (username == 'user') {
            role = USER_ROLES.public
        }
 
        // Set the token as header for your requests!
        $http.defaults.headers.common['X-Auth-Token'] = token;

        console.log('useCredentials');
    }
 
    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['X-Auth-Token'] = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);

        console.log('destroyUserCredentials');
    }
 
    var login = function(name, pw) {
        console.log('login function')
        return $q(function(resolve, reject) {
            if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
                // Make a request and receive your auth token from your server
                storeUserCredentials(name + '.yourServerToken');
                console.log('login success')
                resolve('Login success.');
            } else {
                console.log('login failed')
                reject('Login Failed.');
            }
        });
    };
 
    var logout = function() {
        console.log('lgout function')
        destroyUserCredentials();
    };
 
    var isAuthorized = function(authorizedRoles) {
        console.log('isAuthorized function')
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };
 
    loadUserCredentials();
 
    return {
        login: login,
        logout: logout,
        isAuthorized: isAuthorized,
        isAuthenticated: function() {return isAuthenticated;},
        username: function() {return username;},
        role: function() {return role;}
    };

})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    console.log('AuthInterceptor intercepting')

    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
    };

})
 
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});