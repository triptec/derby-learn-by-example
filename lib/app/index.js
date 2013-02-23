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