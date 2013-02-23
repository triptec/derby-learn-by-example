Derby: Learn by example
=======================

Now first things first, get this (http://open.spotify.com/album/37PmPATTGfiCR5TjAbBzS1) album playing on your soundsystem. If you got any good music please send it to me on spotify (http://open.spotify.com/user/sniglekott).

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
    
First of lets create a _newSnippet model that will hold the values right before model.ref(..)

    model.set('_newSnippet',{
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
    
            model.set('_newSnippet',{
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
    
      <form id=newSnippet x-bind="submit: addSnippet">
        Title:<br>
        <input id=title value={_newSnippet.title}><br>
        Description:<br>
        <input id=description value={_newSnippet.description}><br>
        Source:<br>
        <input id=source value={_newSnippet.source}><br>
        <input id=add-button type=submit value=Add>
      </form>

Save and start the server, it should look something like this (IMAGE 043)

As you can see the form is populated by the _newSnippet model but pressing add still just adds that static snippet, now we would like to edit this and add our own snippet.

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
    
            model.set('_newSnippet',{
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

    newSnippet = model.get("_newSnippet");

    if(newSnippet.title && newSnippet.description && newSnippet.source){
        model.push('_snippets', newSnippet);
        model.set('_newSnippet',{
                            title: "title",
                            description: "description",
                            source: "source"
                        });
    }
    
First off, get the _newSnippet object

Second, check that none of the fields is empty

Third, if it checksout push the newSnippet object into the _snippets array

And last, reset the _newSnippet model to the defaults

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
    
            model.set('_newSnippet',{
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
            newSnippet = model.get("_newSnippet");
    
            if(newSnippet.title && newSnippet.description && newSnippet.source){
                model.push('_snippets', newSnippet);
                model.set('_newSnippet',{
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
    
            model.set('_newSnippet',{
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
            newSnippet = model.get("_newSnippet");
    
            if(newSnippet.title && newSnippet.description && newSnippet.source){
                model.push('_snippets', newSnippet);
                model.set('_newSnippet',{
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


Now lets add the new route and the saveSnippet function, first off the route, add this route ater the view route:

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

Now lets add the saveSnippet function, the function looks like this:

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


Start the server go to "/" and then to "/edit/1" and this is what you should see: (IMAGE 054)

Also open "/" in a window and change something and save and see how the list is updated with the new data.



