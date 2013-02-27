Derby: Learn by example
=======================

Now first things first, get this (http://open.spotify.com/album/37PmPATTGfiCR5TjAbBzS1) album playing on your soundsystem. If you got any good music please send it to me on spotify (http://open.spotify.com/user/sniglekott).

# Overview

1.  [01 - Start](#01---start)
2.  [02 - Clean out](#02---clean-out)
3.  [03 - Models](#03---models)
4.  [04 - DOM event binding](#04---dom-event-binding)
5.  [05 - Routes](#05---routes)
6.  [06 - Persistence](#06---persistence)
7.  [07 - Auth](#07---auth)
8.  [08 - Static](#08---static)

01 - Start
----------
Then let's start with opening a terminal and get going with those commands:

    $sudo npm -g install git://github.com/codeparty/derby.git#master
    $derby new derby-learn-by-example
    $cd derby-learn-by-example
    $cat .gitignore

output from the last line:

    .DS_Store
    public/gen
    *.swp

Continue with:

    $echo "node_modules/" >> .gitignore
    $cat .gitignore

output from the last line:

    .DS_Store
    public/gen
    *.swp
    node_modules/

Okay next: 

    $git checkout -b 01-edit-gitignore
    $git add .
    $git commit -am "initial commit"
    $git checkout master
    $git merge 01-edit-gitignore
    $node server.js

Everything seems to be working! It should look like this (IMAGE 01)

02 - Clean out
--------------

Okay so lets start with branching

    $git checkout -b 02-clean-app

So we start in "./lib/app/index.js" and comment out the existing routes and controller function and add our own code. Change

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

Open "./views/app/index.html", it looks like this (comments omitted):

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


Lets change that to(comments omitted):

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
      index


Okay, so now it should look like this (IMAGE 022)

Clean and nice! Let's commit 

    $git commit -am "cleaned out"
    $git checkout master
    $git merge 02-clean-app

03 - Models
-----------

Now let us start with models but first

    $git checkout -b 03-add-model

So we're in a new branch and lets head over to "./lib/app/index.js" change this(comments omitted):

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

To (comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });


We updated the index route and here what we added:

1. We subscribe to a model, from the Derby docs "The model.subscribe method populates a model with data from its associated store and declares that this data should be kept up to date as it changes. It is possible to define subscriptions in terms of path patterns or queries.". So this means that if the data in path "snippster.data" is updated so is our model. Then the callback here's more from the docs "The subscribe callback takes the arguments callback(err, scopedModels...). If the transaction succeeds, err is null. Otherwise, it is a string with an error message. This message is 'disconnected' if Socket.IO is not currently connected. The remaining arguments are scoped models that correspond to each subscribe target’s path respectively."

2. So now data is a scoped model, what is a scoped model? From the docs "Scoped models provide a more convenient way to interact with commonly used paths. They support the same methods, and they provide the path argument to accessors, mutators, and event subscribers.". Sweet, then we use the setNull method, this method will only set the path if it's null, in this case the path "snippster.data" + "snippets" = "snippster.data.snippets" is null and is set to a array of snippets.

3. model.ref sets up a reference to a path. Here's the docs "References make it possible to write business logic and templates that interact with the model in a general way. They redirect model operations from a reference path to the underlying data, and they set up event listeners that emit model events on both the reference and the actual object’s path.
References must be declared per model, since calling model.ref creates a number of event listeners in addition to setting a ref object in the model. When a reference is created, a set model event is emitted. Internally, model.set is used to add the reference to the model."

4. console.log(model.get('_snippets')); should output those new snippets in your console

5. page.render() renders the page. 

Start your server, the rendered page shouldn't have change but in the console you should see you models logged like this:

    ver: 0 - set 'snippster.data.snippets', [ { title: 'Snippet One',
        description: 'Desc of snippet one',
        source: 'print x;' },
      { title: 'Snippet Two',
        description: 'Desc of snippet two',
        source: 'print y;' },
      { title: 'Snippet Three',
        description: 'Desc of snippet three',
        source: 'print z;' } ]


Lets commit this

    $git commit -am "added some models"

Next, wouldn't it be neat to have these models show up on the page? Ofcouse it would!

Open the "./views/app/index.html", should look like this(comments omitted): 

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
      index

Make it look like this(commenst omitted):

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div>Title:{.title}</div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}

Start the server and lo and behold those beautiful snippets! It should look like this (IMAGE 03)

So what happens? Well we removed the static text index and replaced with a bold "Snippets" this everyone get, but the next line we use {#each _snippets} this tag is ended with the {/} tag and iterat over the _snippets array (remember the model.ref('_snippets', data.path() +".snippets")  in the "./lib/app/index.js", this is where it come into play). [For each iteration you get the snippet context so you can use {title}, {description} and {source}]?

Lets commit

    $git commit -am "output the snippets in the index.html view"
    $git checkout master
    $git merge 03-add-model
    
04 - DOM event binding
----------------------

Lets checkout a new branch

    $git checkout -b 04-dom-event-binding
    
What we're going to do is add a button to the index view that when clicked it's going to call a function that will just push another snippet into the _snippets referece (pointing to "snippster.data.snippets", we could use that path also but it's longer to write.

Okay so to get started open "./lib/app/index.js" it should look like this:

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });

Now make it look like this:

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });
    
    ready(function(model) {
        this.addSnippet = function(){
            model.push('_snippets', {
                            title: "Snippet Four",
                            description: "Desc of snippet four",
                            source: "print 4;"
                        });
        }
    });
    
What we've done is add the ready function, similar to jQuery's $(document).ready(). Within it we declare this.addSnippet(), this is the function that will be exposed to the DOM for binding. When called it will push a snippet object to _snippets as promised.

Now open "./views/app/index.html" it looks like this:

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div>Title:{.title}</div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}
      
Well this time we only add one line to the end of the file:

    <button x-bind="click: addSnippet">Add</button>
    
So it should look like:

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div>Title:{.title}</div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}
      <button x-bind="click: addSnippet">Add</button>
      
Save those files and startup the server. Now you should se something like this (IMAGE 041)

And now try press the Add button, a new snippet shows up, this is what got me interested in the first place, I've been doing this jQuery and in a fairly small app it gets tedious and in a bigger one it's a real headace, atleast for me. Now it should look like this (IMAGE 042)

For extra fun open another browser and goto http://localhost:3000 and while looking at both windows click the Add button, now you see both are update instantly (almost atleast)

Lets do a commit

    $git commit -am "Added a dom event binding"
    
Well so far we haven't really done much useful but lets start now. How about being able to add you own snippets?

Open "./lib/app/index.js", should look like this(comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });
    
    ready(function(model) {
        this.addSnippet = function(){
            model.push('_snippets', {
                            title: "Snippet Four",
                            description: "Desc of snippet four",
                            source: "print 4;"
                        });
        }
    });
    
First of lets create a _snippet model that will hold the values right before model.ref(..)

    model.set('_snippet',{
                    title: "",
                    description: "",
                    source: ""
                });
    
    model.ref('_snippets', data.path() +".snippets");
    
So now the "./lib/app/index.js" should look like this(comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
                        
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });
    
    ready(function(model) {
        this.addSnippet = function(){
            model.push('_snippets', {
                            title: "Snippet Four",
                            description: "Desc of snippet four",
                            source: "print 4;"
                        });
        }
    });
    
Save and open the file "./views/app.index.html", it should look like this(comments omitted):

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div>Title:{.title}</div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}
      <button x-bind="click: addSnippet">Add</button>
      
Lets dropp the button and add a form for a new snippet and end up with something like this:

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
    
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div>Title:{.title}</div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}
    
      <form x-bind="submit: addSnippet">
        Title:<br>
        <input id=title value={_snippet.title}><br>
        Description:<br>
        <input id=description value={_snippet.description}><br>
        Source:<br>
        <input id=source value={_snippet.source}><br>
        <input id=add-button type=submit value=Add>
      </form>

Save and start the server, it should look something like this (IMAGE 043)

As you can see the form is populated by the _snippet model but pressing add still just adds that static snippet, now we would like to edit this and add our own snippet.

Crack open "./lib/app/index.js" looks like this(comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
                        
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });
    
    ready(function(model) {
        this.addSnippet = function(){
            model.push('_snippets', {
                            title: "Snippet Four",
                            description: "Desc of snippet four",
                            source: "print 4;"
                        });
        }
    });
    
Lets remove

    model.push('_snippets', {
                    title: "Snippet Four",
                    description: "Desc of snippet four",
                    source: "print 4;"
                });

and replace it with:

    newSnippet = model.get("_snippet");

    if(newSnippet.title && newSnippet.description && newSnippet.source){
        model.push('_snippets', newSnippet);
        model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
    }
    
First off, get the _snippet object

Second, check that none of the fields is empty

Third, if it checksout push the newSnippet object into the _snippets array

And last, reset the _snippet model to the defaults

Now the file should look something like this(comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
    
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });
    
    ready(function(model) {
        this.addSnippet = function(e, el, next){
            newSnippet = model.get("_snippet");
    
            if(newSnippet.title && newSnippet.description && newSnippet.source){
                model.push('_snippets', newSnippet);
                model.set('_snippet',{
                                    title: "title",
                                    description: "description",
                                    source: "source"
                                });
            }
        };
    });
    
Now save and start the server an give this a try. It should look something like this(I filled out the form with my awsome snippet) (IMAGE 044)

Now fill it out with one of your snippets and press add, it should look something like this (IMAGE 045)

Awesome! =), save, commit and merge

    $git commit -am "added functionality to add our own snippets"
    $git checkout master
    $git merge 04-dom-event-binding
    
05 - Routes
-----------

Okay routes, it would be nice. We already have one to index, now I would like a view route to look at a single snippet.

So lets start with "./lib/app/index.js", it looks like this(comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
    
            model.ref('_snippets', data.path() +".snippets");
            console.log(model.get('_snippets'));
            page.render();
        });
    
    });
    
    ready(function(model) {
        this.addSnippet = function(e, el, next){
            newSnippet = model.get("_snippet");
    
            if(newSnippet.title && newSnippet.description && newSnippet.source){
                model.push('_snippets', newSnippet);
                model.set('_snippet',{
                                    title: "title",
                                    description: "description",
                                    source: "source"
                                });
            }
        };
    });
    
Lets add the view route after the index route:

    get('/view/:snippetId', function(page, model, params){
    
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.ref('_snippet', data);
            console.log(model.get('_snippet'));
            page.render();
        });
    });
    
    
So this is what's going on:

1. When the route /view/:snippetId is called aka someone tried to access /view/1 or /view/foo this route will be called. The part after /view/ goes into params.snippetId so in the two cases /view/1 and /view/foo would result in params.snippetId == "1" and params.snippetId == "foo" respectively.
2. It subscribes to the requested snippet, this might be a little hard to understand without reading the docs but when we create a array a model the path to the items will be `collection.<index>` so in our case there will be a `snippster.data.snippets.0` and `snippster.data.snippets.1` etc. 
3. It refereces the snippet and logs the snippet.
4. Finishes with rendering the page.

Start your server and goto http://localhost:3000 first to populate the snippets and then to http://localhost:3000/view/1

If you look in the servers terminal somewhere you should see somthing like this:

    { title: 'Snippet Two',
      description: 'Desc of snippet two',
      source: 'print y;'}
    
Though if we try http://localhost:3000/view/foobar you will only see undefined in the console that's because there isn't any `snippster.data.snippets.foobar` so first lets only allow numbers in the route, change:

    get('/view/:snippetId', function(page, model, params){
    
to

    get('/view/:snippetId([0-9]+)', function(page, model, params){
    
That will make sure it's only numbers and atleast one number, otherwise the user will get a 404

But what if the number requested doens't exist? Well then lets just serv them with a 404 in that case aswell. Here's the new route

    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.ref('_snippet', data);
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render();
        });
    });
    
So now your "./lib/app/index.js" should look something like this(comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
    
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
    
            model.ref('_snippets', data.path() +".snippets");
            page.render();
        });
    
    });
    
    
    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.ref('_snippet', data);
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render();
        });
    });

    ready(function(model) {
        this.addSnippet = function(e, el, next){
            newSnippet = model.get("_snippet");
    
            if(newSnippet.title && newSnippet.description && newSnippet.source){
                model.push('_snippets', newSnippet);
                model.set('_snippet',{
                                    title: "title",
                                    description: "description",
                                    source: "source"
                                });
            }
        };
    });
Start your server and goto http://localhost:3000/view/1, now you should see this (IMAGE 051), the snippet isn't created yet. Now goto http://localhost:3000 and then goto http://localhost:3000/view/1 and now you should see this (IMAGE 052).

Lets get a view to go with this new shiny route

Create a new file "./views/app/view.html" and paste this code into it:

    <Body:>
      <strong>Snippet:</strong>
      <div>
        <div>Title:{_snippet.title}</div>
        <div>Description:</div>
        <div>{_snippet.description}</div>
        <div>source:</div>
        <div>{_snippet.source}</div>
      </div>

We also need to include this line in the top of "./views/app/index.html":

    <import: src="./view">
    
So now it looks like this(comments omitted):
    
    <import: src="./view">

    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
    
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div>Title:{.title}</div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}
    
      <form x-bind="submit: addSnippet">
        Title:<br>
        <input id=title value={_snippet.title}><br>
        Description:<br>
        <input id=description value={_snippet.description}><br>
        Source:<br>
        <input id=source value={_snippet.source}><br>
        <input id=add-button type=submit value=Add>
      </form>

Save the file and go back to "./lib/app/index.js" and change the `page.render();` line in the view route to `page.render('view');`. This tells derby to look for the view template instead if the index template.???

It should look like this(comments omitted):

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;"
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;"
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;"
                }
            ]);
    
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
    
            model.ref('_snippets', data.path() +".snippets");
            page.render();
        });
    
    });
    
    
    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.ref('_snippet', data);
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render('view');
        });
    });

    ready(function(model) {
        this.addSnippet = function(e, el, next){
            newSnippet = model.get("_snippet");
    
            if(newSnippet.title && newSnippet.description && newSnippet.source){
                model.push('_snippets', newSnippet);
                model.set('_snippet',{
                                    title: "title",
                                    description: "description",
                                    source: "source"
                                });
            }
        };
    });
Now save and restart your server and goto the "/" first and then to "/view/1", it should look like this (IMAGE 053)

##NOTE TO SOMEONE, EXPLAIN HOW THIS WORKS!

Okay now lets add another view, create a new file "./views/app/edit.html" and paste this code:

    <Body:>
      Edit snippet:
      <form id=snippet x-bind="submit: saveSnippet">
        Title:<br>
        <input id=title value={_snippet.title}><br>
        Description:<br>
        <input id=description value={_snippet.description}><br>
        Source:<br>
        <input id=source value={_snippet.source}><br>
        <input id=add-button type=submit value=Save>
      </form>


Now lets add the new route and the saveSnippet function, first off the route, add this route after the view route:

    get('/edit/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.set('_snippet', model.get(data.path()));
            if(!model.get(data.path()))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render('edit');
        });
    });


As you can see the only difference between the edit route and the view route is the actual route is /edit instead of /view and page.render('edit') instead of page.render('view') and that we don't reference the snippet, we don't want to update the snippet before we press save.

We need to modify the snippets and add a id attribute to make our life simpler when we save them (Possible better solution is welcome!). Here's the code:

    data.setNull('snippets',[
        {
            title: "Snippet One",
            description: "Desc of snippet one",
            source: "print x;",
            id: 0

        },
        {
            title: "Snippet Two",
            description: "Desc of snippet two",
            source: "print y;",
            id: 1
        },
        {
            title: "Snippet Three",
            description: "Desc of snippet three",
            source: "print z;",
            id: 2
        }
    ]);

Now lets change the addSnippet function to saveSnippet function, the function looks like this:

    this.saveSnippet = function(e, el, next){
        snippet = model.get('_snippet');
        if(snippet.title && snippet.description && snippet.source){
            if(!snippet.id){
                snippets = model.get('snippster.data.snippets');
                snippet.id = snippets.length;
                model.push('snippster.data.snippets', snippet);
            }else{
                //Works
                model.set('snippster.data.snippets.'+ snippet.id +'.title', snippet.title);
                model.set('snippster.data.snippets.'+ snippet.id +'.description', snippet.description);
                model.set('snippster.data.snippets.'+ snippet.id +'.source', snippet.source);

                //Doesn't work (Well it set the model but lists adds another item and on refresh shows everything right
                //model.set('snippster.data.snippets.'+ snippet.id', snippet);
            }
        }
    };
    
The file ("./lib/app/index.js") should look like this(comments omitted):


    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()
    
    derby.use(require('../../ui'))
    
    
    // ROUTES //
    
    
    get('/', function(page, model, params) {
    
        model.subscribe('snippster.data', function(err, data){
    
            data.setNull('snippets',[
                {
                    title: "Snippet One",
                    description: "Desc of snippet one",
                    source: "print x;",
                    id: 0
    
                },
                {
                    title: "Snippet Two",
                    description: "Desc of snippet two",
                    source: "print y;",
                    id: 1
                },
                {
                    title: "Snippet Three",
                    description: "Desc of snippet three",
                    source: "print z;",
                    id: 2
                }
            ]);
    
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
    
            model.ref('_snippets', data.path() +".snippets");
            page.render();
        });
    
    });
    
    
    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.ref('_snippet', data);
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render('view');
        });
    });
    
    get('/edit/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.set('_snippet', model.get(data.path()));
            if(!model.get(data.path()))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render('edit');
        });
    });
    
    ready(function(model) {
        this.saveSnippet = function(e, el, next){
            snippet = model.get('_snippet');
    
            if(snippet.title && snippet.description && snippet.source){
                if(!snippet.id){
                    snippets = model.get('snippster.data.snippets');
                    snippet.id = snippets.length;
                    model.push('snippster.data.snippets', snippet);
                }else{
                    //Works
                    model.set('snippster.data.snippets.'+ snippet.id +'.title', snippet.title);
                    model.set('snippster.data.snippets.'+ snippet.id +'.description', snippet.description);
                    model.set('snippster.data.snippets.'+ snippet.id +'.source', snippet.source);
    
                    //Doesn't work (Well it set the model but lists adds another item and on refresh shows everything right
                    //model.set('snippster.data.snippets.'+ snippet.id', snippet);
                }
            }
        };
    });



"./views/app/index.html"

    <import: src="./view">
    <import: src="./edit">
    
    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
    
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div>Title:{.title}</div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}
    
      <form x-bind="submit: saveSnippet">
        Title:<br>
        <input id=title value={_snippet.title}><br>
        Description:<br>
        <input id=description value={_snippet.description}><br>
        Source:<br>
        <input id=source value={_snippet.source}><br>
        <input id=add-button type=submit value=Add>
      </form>


Start the server go to "/" and then to "/edit/1" and this is what you should see: (IMAGE 054)

Also open "/" in a window and change something and save and see how the list is updated with the new data.

Lets commit this

    $git add .
    $git commit -am "added some routes and some views"

Lets add some links so we don't need to write in the locationbar the whole time:

"./views/index.html":

    <import: src="./view">
    <import: src="./edit">
    
    <Title:>
      Snippster
    
    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>
    
    <Body:>
    
      <strong>Snippets:</strong>
      {#each _snippets}
        <div>
          <div><a href="/view/{.id}">Title:{.title}</a></div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}
    
      New Snippet:
      <form x-bind="submit: saveSnippet">
        Title:<br>
        <input value={_snippet.title}><br>
        Description:<br>
        <input value={_snippet.description}><br>
        Source:<br>
        <input value={_snippet.source}><br>
        <input id=add-button type=submit value=Save>
      </form>

"./views/view.html":

    <Body:>
      <strong>Snippet:</strong>
      <div>
        <div>Title:{_snippet.title}</div>
        <div>Description:</div>
        <div>{_snippet.description}</div>
        <div>source:</div>
        <div>{_snippet.source}</div>
      </div>
      <a href="/">Home</a><br>
      <a href="/edit/{_snippet.id}">Edit</a>

"./views/edit.html":

    <Body:>
      Edit snippet:
      <form id=snippet x-bind="submit: saveSnippet">
        Title:<br>
        <input id=title value={_snippet.title}><br>
        Description:<br>
        <input id=description value={_snippet.description}><br>
        Source:<br>
        <input id=source value={_snippet.source}><br>
        <input id=add-button type=submit value=Save>
      </form>
      <a href="/">Home</a><br>
      <a href="/view/{_snippet.id}">View</a>

Here's how the views look like now IMAGE 055, 056, 057

Lets commit and merge

    $git commit -am "added some links"
    $git checkout master
    $git merge 05-routes
    
06 - Persistence
----------------

Now lets add some persistence to the app so the snippets don't disappear when the server is restarted.

First install mongodb for your OS http://docs.mongodb.org/manual/tutorial/

First thing to do is to add a dependence to "./package.json". Now it should look something like this:

    {
      "name": "derby-learn-by-example",
      "description": "",
      "version": "0.0.0",
      "main": "./server.js",
      "dependencies": {
        "derby": "*",
        "express": "3.x",
        "gzippo": ">=0.2.0"
      },
      "private": true
    }

Change that to:

    {
      "name": "derby-learn-by-example",
      "description": "",
      "version": "0.0.0",
      "main": "./server.js",
      "dependencies": {
        "derby": "*",
        "express": "3.x",
        "gzippo": ">=0.2.0",
        "racer-db-mongo": "*"
      },
      "private": true
    }


Run "npm install" to install the new dependencies

Then we need to update the server side to use mongo db

Edit "./lib/server/index.js" and change the line:

    var store = derby.createStore({listen: server})

To:

    derby.use(require('racer-db-mongo')); // This line is new

    var store = derby.createStore({
      listen: server,
      db:      {type: 'Mongo', uri: 'mongodb://localhost/snippets'}
    })


now we can remove the mockup data and start using real data

remove from "./lib/app/index.js"

    data.setNull('snippets', [
      {
        title: "Snippet One",
        description: "Desc of snippet one",
        source: "print x;"
      },
      {
        title: "Snippet Two",
        description: "Desc of snippet two",
        source: "print y;"
      },
      {
        title: "Snippet Three",
        description: "Desc of snippet three",
        source: "print z;"
      }
    ]);

further down we need to change the view and edit routes from this:

    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.ref('_snippet', data);
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render('view');
        });
    });

    get('/edit/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets.' + params.snippetId, function(err, data){
            model.set('_snippet', model.get(data.path()));
            if(!model.get(data.path()))
                throw '404: ' + params.url
            console.log(model.get('_snippet'));
            page.render('edit');
        });
    });

To this:

    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            model.ref('_snippet', data.at(params.snippetId));
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            page.render('view');
        });
    });

    get('/edit/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            model.set('_snippet', model.get(data.path() + "." + params.snippetId));
            if(!model.get(data.path()))
                throw '404: ' + params.url
            page.render('edit');
        });
    });

And lastly the saveSnippet function from:

    ready(function(model) {
        this.saveSnippet = function(e, el, next){
            snippet = model.get('_snippet');

            if(snippet.title && snippet.description && snippet.source){
                if(!snippet.id){
                    snippets = model.get('snippster.data.snippets');
                    snippet.id = snippets.length;
                    model.push('snippster.data.snippets', snippet);
                }else{
                    //Works
                    model.set('snippster.data.snippets.'+ snippet.id +'.title', snippet.title);
                    model.set('snippster.data.snippets.'+ snippet.id +'.description', snippet.description);
                    model.set('snippster.data.snippets.'+ snippet.id +'.source', snippet.source);

                    //Doesn't work (Well it set the model but lists adds another item and on refresh shows everything right
                    //model.set('snippster.data.snippets.'+ snippet.id', snippet);
                }
            }
        };
    });

To:

    ready(function(model) {
        this.saveSnippet = function(e, el, next){
            snippet = model.get('_snippet');
            if(snippet.title && snippet.description && snippet.source){
                if(snippet.id == undefined){
                    snippets = model.get('snippster.data.snippets');
                    if(snippets)
                        snippet.id = snippets.length;
                    else
                        snippet.id = 0;

                    model.push('snippster.data.snippets', snippet);
                }else{
                    //Works
                    model.set('snippster.data.snippets.'+ snippet.id +'.title', snippet.title);
                    model.set('snippster.data.snippets.'+ snippet.id +'.description', snippet.description);
                    model.set('snippster.data.snippets.'+ snippet.id +'.source', snippet.source);
                    model.set('snippster.data.snippets.'+ snippet.id +'.id', snippet.id);

                    //Doesn't work (Well it set the model but lists adds another item and on refresh shows everything right
                    //model.set('snippster.data.snippets.'+ snippet.id', snippet);
                }
                app.history.push('/');
            }
        };
    });

All in all the "./lib/app/index.js" should look like this:

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()

    derby.use(require('../../ui'))


    // ROUTES //


    get('/', function(page, model, params) {

        model.subscribe('snippster.data', function(err, data){

            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });

            model.ref('_snippets', data.path() +".snippets");
            page.render();
        });

    });


    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            model.ref('_snippet', data.at(params.snippetId));
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            page.render('view');
        });
    });

    get('/edit/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            model.set('_snippet', model.get(data.path() + "." + params.snippetId));
            if(!model.get(data.path()))
                throw '404: ' + params.url
            page.render('edit');
        });
    });

    ready(function(model) {
        this.saveSnippet = function(e, el, next){
            snippet = model.get('_snippet');
            if(snippet.title && snippet.description && snippet.source){
                if(snippet.id == undefined){
                    snippets = model.get('snippster.data.snippets');
                    if(snippets)
                        snippet.id = snippets.length;
                    else
                        snippet.id = 0;

                    model.push('snippster.data.snippets', snippet);
                }else{
                    //Works
                    model.set('snippster.data.snippets.'+ snippet.id +'.title', snippet.title);
                    model.set('snippster.data.snippets.'+ snippet.id +'.description', snippet.description);
                    model.set('snippster.data.snippets.'+ snippet.id +'.source', snippet.source);
                    model.set('snippster.data.snippets.'+ snippet.id +'.id', snippet.id);

                    //Doesn't work (Well it set the model but lists adds another item and on refresh shows everything right
                    //model.set('snippster.data.snippets.'+ snippet.id', snippet);
                }
                app.history.push('/');
            }
        };
    });

THIS SECTION NEEDS MORE ATTENTION;

Okay so start the server and play around

Lets commit and merge

    $git commit -am "added persistence"
    $git checkout mater
    $git merge 06-persistence

07 - Auth
---------

First of all, I'm out of my depth here and I've tried to be as restrictive as possible but there's probably security flaws
around here lurking. But I guess I rather make a app that's not a 100% than not making a app at all.
Opinions and help are welcome on anything but more so in this section. YOU HAVE BEEN WARNED!

Also from here on I'll be less verbose in code, I'll just show how the code looks after the modifications,
this tutorial is already over 1700 lines and you guys probably learned you way around by now and we only edit a few files.

Okay lets start with adding derby-auth package to our package.json. I use the github repo:

    {
      "name": "derby-learn-by-example",
      "description": "",
      "version": "0.0.0",
      "main": "./server.js",
      "dependencies": {
        "derby": "*",
        "derby-auth": "git://github.com/lefnire/derby-auth.git#master",
        "passport-facebook": "*",
        "express": "3.0.0beta4",
        "gzippo": ">=0.1.7",
        "racer-db-mongo": "*"
      },
      "private": true
    }

So we've added derby-auth and passport-facebook, as you can see I've used the master of
the derby-auth so this might have changed and broken the tutorial by the time you read it,
please tell me in that case as I've been working hard to make derby accessible to anyone.

Yeah, derby-auth gives us register, login and stuff that's really neat for a webb app, the passport-facebook
enable us to login with facebook, also neat as I hate having to register with my email everywhere.

To install these dependencies run:

    $npm install

Okay we need to edit our "./lib/server/index.js" OBSERVE it's the server part.
Those are the lines we are going to modify/add:

    , auth = require('derby-auth')

    //Authentication
    auth.store(store);

    var options, strategies;
    strategies = {
      facebook: {
        strategy: require("passport-facebook").Strategy,
        conf: {
          clientID: process.env.FACEBOOK_KEY,
          clientSecret: process.env.FACEBOOK_SECRET
        }
      }
    };
    options = {
      domain: process.env.BASE_URL || 'http://localhost:3000'
    };

    store.readPathAccess('snippster.*', function (pathFragment, accept, onErr) {
      //var session = this.session;
      //accept(session.isMember);
      accept(true);
    });

    store.writeAccess('*', 'snippster.data.*', function () {
      var pathFragment = arguments[0], accept = arguments[arguments.length - 2], err = arguments[arguments.length -1];
      //var allowed = (userId === this.session.userId);
      //accept(allowed);
      accept(true);
    });

    .use(express.bodyParser())

    .use(express.cookieParser())
    .use(store.sessionMiddleware({
    secret: process.env.SESSION_SECRET || 'YOUR SECRET HERE'
    , cookie: {maxAge: ONE_YEAR}
    }))

    //Auth
    .use(auth.middleware(strategies, options))

1. First off we require derby-auth

2. Next we let auth setup the store for us, it essentially setup access control for the "users" path in the db/models

3. Setup strategies and options for facebook to feed the auth.middleware at the end of this file. The process.env.* variables are
    the ENV variables in the environment you run the server. Later we are going to start the server with `$FACEBOOK_KEY='<your facebook app key>' FACEBOOK_SECRET='<your facebook app secret>' node server.js `
    and those varables gets read that way.

4. Setup our own access control, we'd like to readPathAccess "snippster.*" and now it's setup to accept all reads but later on
    we might change this. Then we setup the writeAccess for all (set,del,push etc) on "snippster.*". The strange line n the beginning
    of the callback is because this callback gets an variable number of arguments but path is always first and accept and err are
    always the last ones if I get other peoples comments.

5. Tell derby to use the bodyParser() this is to read post data (I think, can't register without it at least.)

6. auth needs sessions and cookies

7. At last tell derby to use auth and give auth the strategies and options.

Now the file should look like this:

    var http = require('http')
      , path = require('path')
      , express = require('express')
      , gzippo = require('gzippo')
      , derby = require('derby')
      , auth = require('derby-auth')
      , app = require('../app')
      , serverError = require('./serverError')


    // SERVER CONFIGURATION //

    var expressApp = express()
      , server = module.exports = http.createServer(expressApp)

    derby.use(derby.logPlugin)
    derby.use(require('racer-db-mongo')); // This line is new

    var store = derby.createStore({
      listen: server,
      db:      {type: 'Mongo', uri: 'mongodb://localhost/snippets'}
    })

    //Authentication
    auth.store(store);

    var options, strategies;
    strategies = {
      facebook: {
        strategy: require("passport-facebook").Strategy,
        conf: {
          clientID: process.env.FACEBOOK_KEY,
          clientSecret: process.env.FACEBOOK_SECRET
        }
      }
    };
    options = {
      domain: process.env.BASE_URL || 'http://localhost:3000'
    };

    store.readPathAccess('snippster.*', function (pathFragment, accept, onErr) {
      //var session = this.session;
      //accept(session.isMember);
      accept(true);
    });

    store.writeAccess('*', 'snippster.data.*', function () {
      var pathFragment = arguments[0], accept = arguments[arguments.length - 2], err = arguments[arguments.length -1];
      //var allowed = (userId === this.session.userId);
      //accept(allowed);
      accept(true);
    });

    var ONE_YEAR = 1000 * 60 * 60 * 24 * 365
      , root = path.dirname(path.dirname(__dirname))
      , publicPath = path.join(root, 'public')

    expressApp
      .use(express.favicon())
      // Gzip static files and serve from memory
      .use(gzippo.staticGzip(publicPath, {maxAge: ONE_YEAR}))
      // Gzip dynamically rendered content
      .use(express.compress())

      // Uncomment to add form data parsing support
      .use(express.bodyParser())
      // .use(express.methodOverride())

      // Uncomment and supply secret to add Derby session handling
      // Derby session middleware creates req.model and subscribes to _session
      .use(express.cookieParser())
      .use(store.sessionMiddleware({
        secret: process.env.SESSION_SECRET || 'YOUR SECRET HERE'
      , cookie: {maxAge: ONE_YEAR}
      }))

      // Adds req.getModel method
      .use(store.modelMiddleware())
      // Creates an express middleware from the app's routes

      //Auth
      .use(auth.middleware(strategies, options))

      .use(app.router())
      .use(expressApp.router)
      .use(serverError(root))


    // SERVER ONLY ROUTES //

    expressApp.all('*', function(req) {
      throw '404: ' + req.url
    })


In "./lib/app/index.js" we add, this will give us components to use in our views, like login form and register form.

    derby.use(require('derby-auth/components'));

And we add error check in our model.subscribe functions, this makes it easier to debug if you get your access control wrong.

    if(err)
        throw err;

So it now looks like this:

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()

    derby.use(require('../../ui'))
    derby.use(require('derby-auth/components'));

    // ROUTES //

    get('/', function(page, model, params) {

        model.subscribe('snippster.data', function(err, data){

            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });

            model.ref('_snippets', data.path() +".snippets");
            page.render();
        });

    });

    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            if(err)
                throw err;
            model.ref('_snippet', data.at(params.snippetId));
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            page.render('view');
        });
    });

    get('/edit/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            if(err)
                throw err;
            model.set('_snippet', model.get(data.path() + "." + params.snippetId));
            if(!model.get(data.path()))
                throw '404: ' + params.url
            page.render('edit');
        });
    });

    ready(function(model) {
        this.saveSnippet = function(e, el, next){
            snippet = model.get('_snippet');
            if(snippet.title && snippet.description && snippet.source){
                if(snippet.id == undefined){
                    snippets = model.get('snippster.data.snippets');
                    if(snippets)
                        snippet.id = snippets.length;
                    else
                        snippet.id = 0;

                    model.push('snippster.data.snippets', snippet);
                }else{
                    //Works
                    model.set('snippster.data.snippets.'+ snippet.id +'.title', snippet.title);
                    model.set('snippster.data.snippets.'+ snippet.id +'.description', snippet.description);
                    model.set('snippster.data.snippets.'+ snippet.id +'.source', snippet.source);
                    model.set('snippster.data.snippets.'+ snippet.id +'.id', snippet.id);

                    //Doesn't work (Well it set the model but lists adds another item and on refresh shows everything right
                    //model.set('snippster.data.snippets.' + snippet.id, snippet);
                }
                app.history.push('/');
            }
        };
    });

And lastly lets add login form, register form and a link to login with facebook to "./views/app/index.html", this is how it's supposed to look:

    <import: src="./view">
    <import: src="./edit">

    <Title:>
      Snippster

    <Header:>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>

    <Body:>

      <div>
        {#if _loggedIn}
          <div>Logged In</div>
          <a href="/logout">Logout</a>
        {else}
          <div><a href="/auth/facebook">Login with facebook</a></div>
          <derby-auth:login />
          <derby-auth:register />
        {/}
      </div>

      <div>
        <strong>Snippets:</strong>
      </div>
      {#each _snippets}
        <div>
          <div><a href="/view/{.id}">Title:{.title}</a></div>
          <div>Description:</div>
          <div>{.description}</div>
          <div>source:</div>
          <div>{.source}</div>
        </div>
      {/}

      New Snippet:
      <form x-bind="submit: saveSnippet">
        Title:<br>
        <input value={_snippet.title}><br>
        Description:<br>
        <input value={_snippet.description}><br>
        Source:<br>
        <input value={_snippet.source}><br>
        <input id=add-button type=submit value=Save>
      </form>

That should do it, save and setup a facebook app at "http://developers.facebook.com" if you don't have one and start the server like so:

    $FACEBOOK_KEY='<your facebook app key>' FACEBOOK_SECRET='<your facebook app secret>' node server.js

Try out the new functions and then we commit, merge.

    $git commit -am "added derby-auth and access control"
    $git checkout master
    $git merge 07-derby-auth

08 - Static
-----------

This section isn't very good written, I let my curiosity get the better of me and just hacked away, though this is a draft it's still bad. Sorry.

In this section we are going to:

1. Add a css/js framework called foundation.
2. Create our own components
3. Add more routes
4. ..

Okay, so first things first. Lets branch

    $git checkout -b 08-static

Okay so now head on over to http://foundation.zurb.com/download.php and download the "Defaut CSS" this package has all the css and js and unpack it in your "./public" so now there should be a structure like:

"./public/foundation/javascripts/"

"./public/foundation/stylesheets/"

"./public/foundation/images/"

I deleted the other files (humans.txt, index.html, robots.txt)

Okay, that's done, now this might not be the best. Open the file "./styles/app/index.styl" and comment out the import, it should look like this:

    //@import "../base";

Next thing is to include the css and js in our "./views/app/index.html" like so:

    <Header:>
      <link rel="stylesheet" href="/foundation/stylesheets/foundation.min.css">
      <link rel="stylesheet" href="/foundation/stylesheets/app.css">
      <!-- Custom Modernizr for Foundation -->
      <script src="/foundation/javascripts/modernizr.foundation.js"></script>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>



    <Scripts:>
      <script src="/foundation/javascripts/jquery.js"></script>

      <!-- Included JS Files (Unminified) -->
      <!-- [JS Files] -->
      <!-- We include all the unminified JS as well. Uncomment to use them instead -->

      <!-- Included JS Files (Minified) -->
      <script src="/foundation/javascripts/foundation.min.js"></script>

      <!-- Initialize JS Plugins -->
      <script src="/foundation/javascripts/app.js"></script>
    </Scripts:>

Okay so that's foundation added and included. We'll update the rest of the views later on so bear with me. Lets commit:

    $git add .
    $git commit -am "Added foundation"

So now lets create our own login, register and reset password components. Or actually they are more or less copied from
derby-auth and customized. Start with creating the dir "./components" and then the file "./components/index.js". The js file should look like this:

    function components(derby, options) {
        var config = {
            ns: 'snippster'
            , filename: __filename
            , scripts: {
                register: require('./register')
                , login: require('./login')
                , reset: require('./reset')
            }
        }
        derby.createLibrary(config, options);
        return this;
    }

    components.decorate = 'derby';
    module.exports = components;

Okay, this is pretty strait forward. In the config we define our namespace (ns: 'snippster',), this is what you will be calling within the templates (`<snippster:login>` for example).
Define the paths included. Not really sure what components.decorate does!

Okay so now lets create the directory "./components/login" and within create "./components/login/index.html", it should look like this:

    <login:>
        {#with :self}
            <form id="derby-auth-login" action='/login' method='post'>
                <div class="row collapse">
                    <div class="two columns"><label class="inline">Username:</label></div>
                    <div class="ten columns"><input type="text" class="{#if .errors.username}error{/}" id="username" name="username" placeholder="John" x-bind="blur:usernameBlur" value="{.username}" /></div>
                    <div class="help-inline">{.errors.username}</div>
                </div>


                  <div class="row collapse">
                    <div class="two columns"><label class="inline">Password:</label></div>
                    <div class="ten columns"><input type="password" class="{#if .errors.password}error{/}" id="password" name="password" placeholder="Password" value="{.password}" /></div>
                    <div class="help-inline">{.errors.password}</div>
                  </div>
                  <button type="submit" class="radius button">Login</button>
            </form>
        {/}

Not much to discus, {#with var} scopes the block with the variable so for example(from handlebars docs slightly modified):

    {
      title: "My first post!",
      author: {
        firstName: "Charles",
        lastName: "Jolley"
      }
    }

And:

    <div class="entry">
      <h1>{{title}}</h1>

      {{#with author}}
      <h2>By {{firstName}} {{lastName}}</h2>
      {{/}}
    </div>

Becomes:

    <div class="entry">
      <h1>My first post!</h1>

      <h2>By Charles Jolley</h2>
    </div>

Okay so lets get some logic in to thing, create "./components/login/index.js" and fill it with this:

    var utils = require('derby-auth/utils')

    exports.init = function(model) {
    }

    exports.create = function(model, dom) {
        // sorry but we need jquery, especially for ajax
        //TODO: Fix searchPath
        //if (!window.$) require('../../public/foundation/javascripts/jquery.js');
    }

    exports.usernameBlur = function(){
        // check username registered
        var model = this.model,
            rootModel = model.parent().parent(),
            q = rootModel.query('users').withUsername(model.get('username'));
        rootModel.fetch(q, function(err, users) {
            try {
                if (err) throw new Error(err);
                var userObj = users.at(0).get()
                if (!userObj) {
                    throw new Error("Username not registered. Make sure you're using the same capitalization you used to register!");
                } else {
                    model.set('errors.username', '');
                }
            } catch (err) {
                model.set('errors.username', err.message);
            }
        });
    }

    exports.loginSubmit = function(e, el){
        // TODO handle server-side login failure response message here, via model.set('errors.password',..)
    }

There's really only one function here and that's exports.usernameBlur() that's called when the username field fires the event blur, it queries the users model and tells us that
the username isn't registered if it can't find it. Else it sets errors.username to ''

Next we create the directory "./components/register" and create the file "./components/register/index.html" and fill it with this:

    <register:>
        {#with :self}
            <form id="derby-auth-register" action='/register' method='post'>

              <div class="row collapse">
                  <div class="two columns"><label class="inline">Username:</label></div>
                  <div class="ten columns"><input type="text" class="{#if .errors.username}error{/}" id="username" name="username" placeholder="John" x-bind="blur:usernameBlur" value="{.username}" /></div>
                  <div class="help-inline">{.errors.username}</div>
              </div>

              <div class="row collapse">
                  <div class="two columns"><label class="inline">Email:</label></div>
                  <div class="ten columns"><input type="text" class="{#if .errors.email}error{/}" id="email" name="email" placeholder="john@doe.com" x-bind="blur:emailBlur" value="{.email}" /></div>
                  <div class="help-inline">{.errors.email}</div>
              </div>

              <div class="row collapse">
                  <div class="two columns"><label class="inline">Password:</label></div>
                  <div class="ten columns"><input type="password" class="{#if .errors.password}error{/}" id="password" name="password" placeholder="" value="{.password}" /></div>
                  <div class="help-inline">{.errors.password}</div>
              </div>

              <div class="row collapse">
                  <div class="two columns"><label class="inline">Password Confirmation:</label></div>
                  <div class="ten columns"><input type="password" class="{#if .errors.passwordConfirmation}error{/}" id="password-confirmation" name="password-confirmation" placeholder="" value="{.passwordConfirmation}" /></div>
                  <div class="help-inline">{.errors.passwordConfirmation}</div>
              </div>

                {#if .canSubmit}
                    <input type="submit" value="Register" class="radius button"/>
                {else}
                    <input type="submit" value="Register" class="radius button disabled" disabled/>
                {/}
            </form>
        {/}

Next create "./components/register/index.js", it should look like this:

    var validator = require('../../node_modules/validator/validator-min'),
        check = validator.check,
        sanitize = validator.sanitize,
        utils = require('derby-auth/utils')

    exports.init = function(model) {
    }

    exports.create = function(model, dom) {
        model.on('set', 'username', function(username){
            if (!username) return
            try {
                check(username).isAlphanumeric();
                model.set('errors.username', '');
            } catch (err) {
                model.set('errors.username', err.message);
            }
        });

        model.on('set', 'email', function(email){
            console.log(email);
            if (!email) return
            try {
                check(email).isEmail();
                model.set('errors.email', '');
            } catch (err) {
                model.set('errors.email', err.message);
            }
        });

        model.on('set', 'passwordConfirmation', function(passwordConfirmation){
            if (!passwordConfirmation) return
            try {
                check(passwordConfirmation).equals(model.get('password'));
                model.set('errors.passwordConfirmation', '');
            } catch (err) {
                model.set('errors.passwordConfirmation', err.message);
            }
        });

        model.on('set', 'password', function(password){
            if (!password) return
            try {
                check(password).len(6);
                model.set('errors.password', '');
            } catch (err) {
                model.set('errors.password', 'Password must be at least 6 characters');
            }
        });

        model.on('set', 'errors.*', function(error){
            var m = model.get(),
                canSubmit = false;
            if (!m.errors.username && !m.errors.email && !m.errors.passwordConfirmation && !m.errors.password &&
                !!m.username && !!m.email && !!m.passwordConfirmation && !!m.password) {
                canSubmit = true;
            }
            model.set('canSubmit', canSubmit);
        })
    }

    exports.usernameBlur = function(){
        // check username not already registered
        var model = this.model,
            rootModel = model.parent().parent(),
            q = rootModel.query('users').withUsername(model.get('username'));
        rootModel.fetch(q, function(err, users) {
            try {
                if (err) throw new Error(err);
                var userObj = users.at(0).get()
                if (userObj) throw new Error('Username already taken');
            } catch (err) {
                model.set('errors.username', err.message);
            }
        });
    }

    exports.emailBlur = function(){
        // check email not already registered
        var model = this.model,
            rootModel = model.parent().parent(),
            q = rootModel.query('users').withEmail(model.get('email'));
        rootModel.fetch(q, function(err, users) {
            try {
                if (err) throw new Error(err);
                var userObj = users.at(0).get()
                if (userObj) throw new Error('Email already taken');
            } catch (err) {
                model.set('errors.email', err.message);
            }
        });
    }

As you see we use a module called "validator" lets add it to our "./package.json". Here's the definitions:

    {
      "name": "derby-learn-by-example",
      "description": "",
      "version": "0.0.0",
      "main": "./server.js",
      "dependencies": {
        "derby": "*",
        "derby-auth": "git://github.com/lefnire/derby-auth.git#master",
        "validator": "*",
        "passport-facebook": "*",
        "express": "3.0.0beta4",
        "gzippo": ">=0.1.7",
        "racer-db-mongo": "*"
      },
      "private": true
    }

Run:
    $npm install

Okay so now we got the validator module, lets go on and make a reset component, create "./components/reset/" directory and then "./components/reset/index.html" fill it with this:

    <reset:>
      {#with :self}
        <form id="derby-auth-password-reset" x-bind="submit:submitPasswordReset" method='post' class='well'>
            <h3>Email New Password</h3>

            <div class="alert alert-success">{.success.passwordReset}</div>
          <div class="row collapse">
                <div class="two columns"><label class="inline">Email:</label></div>
                <div class="ten columns"><input type='text' class="{#if .errors.passwordReset}error{/}" id="emailReset" name="emailReset" placeholder="Email" value="{.passwordResetEmail}"/></div>
                <div class="help-inline">{.errors.passwordReset}</div>
            </div>

            <button type="submit" class="radius button">Reset Password</button>
        </form>
      {/}

And then create "./components/reset/index.js" and this is what you shall fill it with:

    var utils = require('derby-auth/utils')

    exports.init = function(model) {
    }

    exports.create = function(model, dom) {
        if (!window.$) require('../../public/foundation/javascripts/jquery.js');
    }

    exports.showPasswordReset = function() {
        $('#derby-auth-password-reset').toggle('fast');
    }

    exports.submitPasswordReset = function() {
        // check username registered
        var model = this.model,
            rootModel = model.parent().parent(),
            q = rootModel.query('users').withEmail(model.get('passwordResetEmail'));
        rootModel.fetch(q, function(err, users) {
            try {
                if (err) throw new Error(err);
                var userObj = users.at(0).get()
                if (!userObj) {
                    throw new Error('Email not registered.');
                } else {
                    model.set('errors.passwordReset', '');
                    $.ajax({
                        type: 'POST',
                        url: "/password-reset",
                        data: {
                            email: model.get('passwordResetEmail')
                        },
                        success: function(response){
                            model.set('success.passwordReset', response);
                        },
                        error: function(e) {
                            console.log(e);
                            throw e.responseText;
                        }
                    })

                }
            } catch (err) {
                model.set('errors.passwordReset', err.message);
            }
        });
    }

Okay so that was our components. Lets put them to use, first we need to include them in "./lib/app/index.js", you can see that we changed line #9, so now we require our own instead of derby-auth's components. I also added new routes, /new and /login, the new route is for new snippets and login is for login/regestering/reseting password. Here's the code:

    var derby = require('derby')
      , app = derby.createApp(module)
      , get = app.get
      , view = app.view
      , ready = app.ready
      , start = +new Date()

    derby.use(require('../../ui'))
    derby.use(require('../../components'));

    // ROUTES //

    get('/', function(page, model, params) {

        model.subscribe('snippster.data', function(err, data){
            if(err)
                throw err;
            model.set('_snippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });

            model.ref('_snippets', data.path() +".snippets");
            page.render();
        });

    });

    get('/view/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            if(err)
                throw err;
            model.ref('_snippet', data.at(params.snippetId));
            if(!model.get('_snippet'))
                throw '404: ' + params.url
            page.render('view');
        });
    });

    get('/edit/:snippetId([0-9]+)', function(page, model, params){
        model.subscribe('snippster.data.snippets', function(err, data){
            if(err)
                throw err;
            model.set('_snippet', model.get(data.path() + "." + params.snippetId));
            if(!model.get(data.path()))
                throw '404: ' + params.url
            page.render('edit');
        });
    });

    get('/new', function(page, model, params){
        model.set('_snippet',{
                        title: "",
                        description: "",
                        source: ""
                    });

        page.render('new');
    });

    get('/login', function(page, model, params){
        page.render('login');
    });

    ready(function(model) {
        this.saveSnippet = function(e, el, next){
            snippet = model.get('_snippet');
            if(snippet.title && snippet.description && snippet.source){
                if(snippet.id == undefined){
                    snippets = model.get('snippster.data.snippets');
                    if(snippets)
                        snippet.id = snippets.length;
                    else
                        snippet.id = 0;

                    model.push('snippster.data.snippets', snippet);
                }else{
                    //Works
                    model.set('snippster.data.snippets.'+ snippet.id +'.title', snippet.title);
                    model.set('snippster.data.snippets.'+ snippet.id +'.description', snippet.description);
                    model.set('snippster.data.snippets.'+ snippet.id +'.source', snippet.source);
                    model.set('snippster.data.snippets.'+ snippet.id +'.id', snippet.id);

                    //Doesn't work (Well it set the model but lists adds another item and on refresh shows everything right
                    //model.set('snippster.data.snippets.' + snippet.id, snippet);
                }
                app.history.push('/');
            }
        };
    });

Now we need to use the components and new routes in the templates, lets start with the new view "new" create "./views/app/new.html" fill it with this:

    <Body:>
      <app:topbar>

        <div class="row">

          <div class="nine columns" role="content">
            <fieldset>
              <legend>New Snippet</legend>

              <form id=snippet x-bind="submit: saveSnippet">
                <label>Title</label>
                <input type=text placeholder="Title" value={_snippet.title}>
                <label>Description</label>
                <textarea placeholder="Description of the snippet..">
                  {_snippet.description}
                </textarea>

                <label>Source</label>
                <textarea placeholder="Snippet..">
                  {_snippet.source}
                </textarea>
                <button class="radius button" id=add-button type=submit>Save</button>
              </form>

            </fieldset>
          </div>
        </div>

You can see the `<app:topbar>`, this is a component we define in "./views/app/index.html" and this is how it looks:

    <import: src="./view">
    <import: src="./edit">
    <import: src="./new">
    <import: src="./login">

    <Title:>
      Snippster

    <Header:>
      <link rel="stylesheet" href="/foundation/stylesheets/foundation.min.css">
      <link rel="stylesheet" href="/foundation/stylesheets/app.css">
      <!-- Custom Modernizr for Foundation -->
      <script src="/foundation/javascripts/modernizr.foundation.js"></script>
      <!-- This is a component defined in the /ui directory -->
      <ui:connectionAlert>

    <Body:>
      <app:topbar>

      <div class="row">
        {#each _snippets}
          <div class="six columns">
            <div class="panel">
              <h4><a href="/view/{.id}">{.title}</a></h4>
              <h5 class="subheader">{.description}</h5>
              <p>
                <code>{.source}</code>
              </p>
            </div>
          </div>
        {/}
      </div>
    <Scripts:>
      <script src="/foundation/javascripts/jquery.js"></script>

      <!-- Included JS Files (Unminified) -->
      <!-- [JS Files] -->
      <!-- We include all the unminified JS as well. Uncomment to use them instead -->

      <!-- Included JS Files (Minified) -->
      <script src="/foundation/javascripts/foundation.min.js"></script>

      <!-- Initialize JS Plugins -->
      <script src="/foundation/javascripts/app.js"></script>
    </Scripts:>

    <topbar:>
      <!-- Top Bar -->

      <nav class="top-bar">
        <ul>
          <!-- Title Area -->
          <li class="name">
            <h1>
              <a href="/">
                Snippster.io
              </a>
            </h1>
          </li>
          <li class="toggle-topbar"><a href="#"></a></li>
        </ul>

        <section>

          <ul class="left">
            <li class="divider"></li>
              <li><a href="/new">New snippet</a></li>
          </ul>

          <!-- Right Nav Section -->
          <ul class="right">
            <li class="divider"></li>
            <li class="has-dropdown">
              <a href="#">Menu</a>
              <ul class="dropdown">
                {#if _loggedIn}
                <li><a href="/logout">Logout</a></li>
                {else}
                <li><a href="/auth/facebook">Sign in with facebook</a></li>
                <li class="divider"></li>
                <li><a href="/login#registerForm">Register</a></li>
                <li><a href="/login">Login</a></li>
                {/}
              </ul>
            </li>
          </ul>
        </section>
      </nav>

      <!-- End Top Bar -->
    </topbar:>

Here you see we've done some changes, mainly we included new and login also you can see the definition of `<topbar:>` that is used when we use the `<app:topbar>` lets create the login view ("./views/app/login.html":

    <Body:>
      <app:topbar>

      <div class="row">

          <!-- Login -->
          <div class="nine columns">

            <h3>Hello!</h3>
            <p>Nunc posuere quam nec lacus vehicula in blandit purus vestibulum. Donec non lorem a magna tincidunt vestibulum. Proin vitae diam nibh. Vivamus euismod, lectus quis vestibulum scelerisque, ante velit posuere elit, eu ultricies velit leo vitae massa.</p>

            <dl class="contained tabs">
              <dd class="active"><a href="#loginForm">Login</a></dd>
              <dd><a href="#registerForm">Register</a></dd>
              <dd><a href="#resetForm">Reset</a></dd>
            </dl>

            <ul class="tabs-content contained">
              <li id="loginFormTab" class="active">
                <snippster:login />
              </li>

              <li id="registerFormTab">
                <snippster:register />
              </li>

              <li id="resetFormTab">
                <snippster:reset />
              </li>

            </ul>

          </div>

          <!-- End Contact Details -->

Then we need the other updated views:

"./views/app/view.html":

    <Body:>
      <app:topbar>

        <div class="row">

          <div class="nine columns" role="content">
            <h1>{_snippet.title}</h1>
            <h2 class="subheader">{_snippet.description}</h2>
            <p>
              <code>{_snippet.source}</code>
            </p>
            <a href="/edit/{_snippet.id}" class="radius button">Edit</a>
          </div>
        </div>

"./views/app/edit.html":

    <Body:>
      <app:topbar>
        <div class="row">

          <div class="nine columns" role="content">
            <fieldset>
              <legend>Edit Snippet</legend>

              <form id=snippet x-bind="submit: saveSnippet">
                <label>Title</label>
                <input type=text value={_snippet.title}>
                <label>Description</label>
                <textarea>
                  {_snippet.description}
                </textarea>

                <label>Source</label>
                <textarea>
                  {_snippet.source}
                </textarea>
                <button class="radius button" id=add-button type=submit>Save</button>
              </form>

            </fieldset>
          </div>
        </div>

Now save commit and start your server and it should look alot better! =)

    $git add .
    $git commit -am "made some components and added some static files"
    $git checkout master
    $git merge 08-static

09 - Heroku
-----------

Now, it would be nice to show this app of and why not use heroku, get your account at heroku.com and follow their instructions first. Then get back here and do our necessary changes.

Okay lets branch.

    $git checkout -b 09-heroku

Now with heroku installed in your application root path "./" run:

    $heroku create <myApp>

That should have created a heroku app with the name  <myApp> with the url myapp.herokuapp.com, now we need a mongodb on heroku, so install the mongohq addon with

    $heroku addons:add mongohq:sandbox

Okay now we need to update our package.json to tell heroku what version of node and npm to use here's mine:

    {
      "name": "derby-learn-by-example",
      "description": "",
      "version": "0.0.0",
      "main": "./server.js",
      "engines":{
        "node": "0.8.x",
        "npm": "1.2.x"
      },
      "dependencies": {
        "derby": "*",
        "derby-auth": "git://github.com/lefnire/derby-auth.git#master",
        "validator": "*",
        "passport-facebook": "*",
        "express": "3.0.0beta4",
        "gzippo": ">=0.1.7",
        "racer-db-mongo": "*"
      },
      "private": true
    }

Now we also need to tell the heroku router where to pass web requests, so we need to create a file called "./Procfile" and it should look like this:

    web: node server.js

also we need to create a file called "./.env" so that we can try the application before we push it with the application "foreman" foreman uses this file to set it's env variables, should look like this:

    FACEBOOK_KEY='<YOUR_FB_KEY>'
    FACEBOOK_SECRET='<YOUR_FB_SECRET>'

While we're at env variables we need to set those up for heroku as well

    $heroku config:add BASE_URL='http://<myApp>.herokuapp.com'
    $heroku config:add FACEBOOK_KEY='<YOUR_FB_KEY>'
    $heroku config:add FACEBOOK_SECRET='<YOUR_FB_SECRET>'

The mongohq addon added a env variable called MONGOHQ_URL, you can see all your heroku env variables if you run:

    $heroku config

Output:

    === myApp Config Vars
    BASE_URL:        http://myApp.herokuapp.com
    FACEBOOK_KEY:    <YOUR_FB_KEY>
    FACEBOOK_SECRET: <YOUR_FB_SECRET>
    MONGOHQ_URL:     mongodb://heroku:553cd503124837976273b533ede727xx@linus.mongohq.com:100xx/app125216xx
    PATH:            bin:node_modules/.bin:/usr/local/bin:/usr/bin:/bin

So now we need to add the db url to "./lib/server/index.js" we add:

    var store = derby.createStore({
      listen: server,
      db:      {type: 'Mongo', uri: process.env.MONGOHQ_URL || 'mongodb://localhost/snippets'}
    })

After modification:

    var http = require('http')
      , path = require('path')
      , express = require('express')
      , gzippo = require('gzippo')
      , derby = require('derby')
      , auth = require('derby-auth')
      , app = require('../app')
      , serverError = require('./serverError')


    // SERVER CONFIGURATION //

    var expressApp = express()
      , server = module.exports = http.createServer(expressApp)

    derby.use(derby.logPlugin)
    derby.use(require('racer-db-mongo')); // This line is new

    var store = derby.createStore({
      listen: server,
      db:      {type: 'Mongo', uri: process.env.MONGOHQ_URL || 'mongodb://localhost/snippets'}
    })

    //Authentication
    auth.store(store);

    var options, strategies;
    strategies = {
      facebook: {
        strategy: require("passport-facebook").Strategy,
        conf: {
          clientID: process.env.FACEBOOK_KEY,
          clientSecret: process.env.FACEBOOK_SECRET
        }
      }
    };
    options = {
      domain: process.env.BASE_URL || 'http://localhost:3000'
    };


    store.readPathAccess('snippster.*', function (pathFragment, accept, onErr) {
      //var session = this.session;
      //accept(session.isMember);
      accept(true);
    });

    store.writeAccess('*', 'snippster.*', function () {
      var pathFragment = arguments[0], accept = arguments[arguments.length - 2], err = arguments[arguments.length -1];
      //var allowed = (userId === this.session.userId);
      //accept(allowed);
      accept(true);
    });

    var ONE_YEAR = 1000 * 60 * 60 * 24 * 365
      , root = path.dirname(path.dirname(__dirname))
      , publicPath = path.join(root, 'public')

    expressApp
      .use(express.favicon())
      // Gzip static files and serve from memory
      .use(gzippo.staticGzip(publicPath, {maxAge: ONE_YEAR}))
      // Gzip dynamically rendered content
      .use(express.compress())

      // Uncomment to add form data parsing support
      .use(express.bodyParser())
      // .use(express.methodOverride())

      // Uncomment and supply secret to add Derby session handling
      // Derby session middleware creates req.model and subscribes to _session
      .use(express.cookieParser())
      .use(store.sessionMiddleware({
        secret: process.env.SESSION_SECRET || 'YOUR SECRET HERE'
      , cookie: {maxAge: ONE_YEAR}
      }))

      // Adds req.getModel method
      .use(store.modelMiddleware())
      // Creates an express middleware from the app's routes

      //Auth
      .use(auth.middleware(strategies, options))

      .use(app.router())
      .use(expressApp.router)
      .use(serverError(root))


    // SERVER ONLY ROUTES //

    expressApp.all('*', function(req) {
      throw '404: ' + req.url
    })

That should do it, now run:

    $git add .
    $git commit -am "made changes for heroku"
    $git push heroku 09-heroku:master
    $heroku ps:scale web=1


The line `$git push heroku 09-heroku:master` tells git to push our 09-heroku to the master branch on heroku, you have to do this as the master branch is the only one deployed on heroku.

Now your app should be running smoothly, remember to change the settings of your facebook app to use the new domain if you want to be able to login using it.

Take a look at the heroku url and then merge

    $git checkout master