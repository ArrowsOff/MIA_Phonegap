angular.module('starter.constants', [])

.constant('AUTH_EVENTS', {
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
})

// Dit moet van de database komen
.constant('USER_ROLES', {
	admin: 'admin_role',
	public: 'public'
})