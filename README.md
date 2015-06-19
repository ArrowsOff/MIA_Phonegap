# MIA_Phonegap

## Purpose
Changing habits through the 3 R's: Reminder, Routine and Reward with a touch of personality.
(Source: http://jamesclear.com/three-steps-habit-change)


## Framework
**Ionic 1.0.0**: we use Ionic to make use of AngularJS on mobile and the great building tools that come with Ionic-cli


## UI
**Materialize.css**: For a design pattern we choose for Material Design from Google. We choose this framework because it is widely accepted by most mobile users.

**Color Palette**: from the Material Design Color Palette, we are going to work with the colors Indigo and Pink. Bright Pinks stimulate energy and encourage action and confidence. Indigo (purple family) has and uplifting effect.


## Build Process
**Node**: We used node for our development packages. Development packages like gulp. To use these packages your will have to run 'npm install' in your cli.
<pre><code>npm install</code></pre>

**Bower**: We have used bower for our deployment packages. These can be used by running 'Bower install' in your cli.
<pre><code>bower install</code></pre>

**Gulp**: For compiling our app we use gulp. We've created a couple of gulp-runners to build it.
<pre><code>gulp</code></pre>


## Plugins
**Facebook OAuth**: We are using Facebook Login for our gamification platform. When a user logs in his Email and Name are registered via OAuth. We are doing this through the ngCordova plugins on Angularjs. This will require an InAppBrowser plugin and the cordova Whitelist plugin. 

**InAppBrowser**: InAppBrowser is required for Facebook OAuth.
<pre><code>ionic plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git</code></pre>

**Whitelist**: Whitelist plugin is required to allow connection to Facebook.
<pre><code>ionic plugin add cordova-plugin-whitelist</code></pre>

**Local Notifications**: 
<pre><code>ionic plugin add https://github.com/katzer/cordova-plugin-local-notifications</code></pre>


## Database
**LocalForage**: LocalForage is an NoSQL database. We use this so we can use this app to its full potential even when offline. 


