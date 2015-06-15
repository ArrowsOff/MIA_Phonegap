# MIA_Phonegap

## Purpose
Changing habits through the 3 R's: Reminder, Routine and Reward with a touch of personality.
(Source: http://jamesclear.com/three-steps-habit-change)


## Framework
**Ionic 1.0.0**: we use Ionic to make use of AngularJS on mobile and the great building tools that come with Ionic-cli


## UI
**Materialize.css**: For a design pattern we choose for Material Design from Google. We choose this framework because it is widely accepted by most mobile users.

**Color Palette**: from the Material Design Color Palette, we are going to work with the colors Indigo and Pink. Bright Pinks stimulate energy and encourage action and confidence. Indigo (purple family) has and uplifting effect.


## Plugins
**Facebook OAuth**: We are using Facebook Login for our gamification platform. When a user logs in his Email and Name are registered via OAuth. We are doing this through the ngCordova plugins on Angularjs. This will require an InAppBrowser plugin and the cordova Whitelist plugin. 

**InAppBrowser**: InAppBrowser is required for Facebook OAuth.

**Withelist**: Whitelist plugin is required to allow connection to Facebook.


## Database
**LocalForage**: LocalForage is an NoSQL database. We use this so we can use this app to its full potential even when offline. 

