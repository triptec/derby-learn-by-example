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