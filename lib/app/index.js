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