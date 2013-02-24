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
