derby learn by example

$sudo npm -g install git://github.com/codeparty/derby.git#master

$derby new derby-learn-by-example

$cd derby-learn-by-example

$cat .gitignore

output:
.DS_Store
public/gen
*.swp

$echo "node_modules/" >> .gitignore

$cat .gitignore

output:
.DS_Store
public/gen
*.swp
node_modules/

$git checkout -b 01-edit-gitignore

$git add .

$git commit -am "initial commit"

$git checkout master

$git merge 01-edit-gitignore

$node server.js

Everything seems to be working! It should look like this (IMAGE 01)

02 - Clean out

Okay so we start in "./lib/app/index.js" and comment out the existing routes and controller function and add our own code. Change

var derby = require('derby')
  , app = derby.createApp(module)
  , get = app.get
  , view = app.view
  , ready = app.ready
  , start = +new Date()

derby.use(require('../../ui'))


// ROUTES //

// Derby routes can be rendered on the client and the server
get('/:roomName?', function(page, model, params) {
  var roomName = params.roomName || 'home'

  // Subscribes the model to any updates on this room's object. Calls back
  // with a scoped model equivalent to:
  //   room = model.at('rooms.' + roomName)
  model.subscribe('rooms.' + roomName, function(err, room) {
    model.ref('_room', room)

    // setNull will set a value if the object is currently null or undefined
    room.setNull('welcome', 'Welcome to ' + roomName + '!')

    room.incr('visits')

    // This value is set for when the page initially renders
    model.set('_timer', '0.0')
    // Reset the counter when visiting a new route client-side
    start = +new Date()

    // Render will use the model data as well as an optional context object
    page.render({
      roomName: roomName
    , randomUrl: parseInt(Math.random() * 1e9).toString(36)
    })
  })
})


// CONTROLLER FUNCTIONS //

ready(function(model) {
  var timer

  // Functions on the app can be bound to DOM events using the "x-bind"
  // attribute in a template.
  this.stop = function() {
    // Any path name that starts with an underscore is private to the current
    // client. Nothing set under a private path is synced back to the server.
    model.set('_stopped', true)
    clearInterval(timer)
  }

  this.start = function() {
    model.set('_stopped', false)
    timer = setInterval(function() {
      model.set('_timer', (((+new Date()) - start) / 1000).toFixed(1))
    }, 100)
  }
  this.start()

})


To:

var derby = require('derby')
  , app = derby.createApp(module)
  , get = app.get
  , view = app.view
  , ready = app.ready
  , start = +new Date()

derby.use(require('../../ui'))


// ROUTES //

get('/', function(page, model, params) {
    page.render();
});
/*
// Derby routes can be rendered on the client and the server
get('/:roomName?', function(page, model, params) {
  var roomName = params.roomName || 'home'

  // Subscribes the model to any updates on this room's object. Calls back
  // with a scoped model equivalent to:
  //   room = model.at('rooms.' + roomName)
  model.subscribe('rooms.' + roomName, function(err, room) {
    model.ref('_room', room)

    // setNull will set a value if the object is currently null or undefined
    room.setNull('welcome', 'Welcome to ' + roomName + '!')

    room.incr('visits')

    // This value is set for when the page initially renders
    model.set('_timer', '0.0')
    // Reset the counter when visiting a new route client-side
    start = +new Date()

    // Render will use the model data as well as an optional context object
    page.render({
      roomName: roomName
    , randomUrl: parseInt(Math.random() * 1e9).toString(36)
    })
  })
})


// CONTROLLER FUNCTIONS //

ready(function(model) {
  var timer

  // Functions on the app can be bound to DOM events using the "x-bind"
  // attribute in a template.
  this.stop = function() {
    // Any path name that starts with an underscore is private to the current
    // client. Nothing set under a private path is synced back to the server.
    model.set('_stopped', true)
    clearInterval(timer)
  }

  this.start = function() {
    model.set('_stopped', false)
    timer = setInterval(function() {
      model.set('_timer', (((+new Date()) - start) / 1000).toFixed(1))
    }, 100)
  }
  this.start()

})
*/

Starting the server again with

$node server.js

It should look something like this (IMAGE 021)

Now that doesn't look like it's clean, lets fix that.

Open "./views/app/index.html", it looks like this:

<!--
  Derby templates are similar to Handlebars, except that they are first
  parsed as HTML, and there are a few extensions to make them work directly
  with models. A single HTML template defines the HTML output, the event
  handlers that update the model after user interaction, and the event handlers
  that update the DOM when the model changes.

  As in Handlebars, double curly braces output a value literally. Derby
  templates add single curly braces, which output a value and set up
  model <- -> view bindings for that object.

  Elements that end in colon define template names. Pre-defined templates
  are capitalized by convention, but template names are case-insensitive.
  Pre-defined templates are automatically included when the page is rendered.
-->

<Title:>
  {{roomName}} - {_room.visits} visits

<Header:>
  <!-- This is a component defined in the /ui directory -->
  <ui:connectionAlert>

<Body:>
  <h1>{_room.welcome}</h1>
  <p><label>Welcome message: <input value="{_room.welcome}"></label></p>

  <!-- Other templates are referenced like HTML elements -->
  <p>This page has been visted {_room.visits} times. <app:timer></p>

  <p>Let's go <a href="/{{randomUrl}}">somewhere random</a>.</p>

<timer:>
  {#if _stopped}
    <a x-bind="click:start">Start timer</a>
  {else}
    You have been here for {_timer} seconds. <a x-bind="click:stop">Stop</a>
  {/}


Lets change that to:

<!--
  Derby templates are similar to Handlebars, except that they are first
  parsed as HTML, and there are a few extensions to make them work directly
  with models. A single HTML template defines the HTML output, the event
  handlers that update the model after user interaction, and the event handlers
  that update the DOM when the model changes.

  As in Handlebars, double curly braces output a value literally. Derby
  templates add single curly braces, which output a value and set up
  model <- -> view bindings for that object.

  Elements that end in colon define template names. Pre-defined templates
  are capitalized by convention, but template names are case-insensitive.
  Pre-defined templates are automatically included when the page is rendered.
-->

<Title:>
  Snippster

<Header:>
  <!-- This is a component defined in the /ui directory -->
  <ui:connectionAlert>

<Body:>
  index


Okay, so now it should look like this (IMAGE 022)




