var app = angular.module('starter.constants', []);

app.constant('AUTH_EVENTS', {
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});

// Dit moet van de database komen
app.constant('USER_ROLES', {
	admin: 'admin_role',
	public: 'public'
});