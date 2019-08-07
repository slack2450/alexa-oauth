var fs = require('fs');
var https = require('https');
var express = require('express');
var session = require('express-session');
var oauth2orize = require('oauth2orize'); 

var app = express();

const cookieSecret = 'rterhegrhesdf';

app.set('view engine', 'pug');
app.use(session({
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true
    }
  }));

var oauthServer = oauth2orize.createServer();

oauthServer.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    var code = utils.uid(2);
  
    var ac = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);
    ac.save(function(err) {
      if (err) { return done(err); }
      return done(null, code);
    });
  }));

oauthServer.serializeClient(function(application, done) {
	done(null, application.title);
});

oauthServer.deserializeClient(function(id, done) {
    application = {
        title: "Name",
        oauth_id: "ahiotbjmbrtheoj",
        oauth_secret: "password",
        domains: ["pitangui.amazon.com", "alexa.amazon.co.jp", "layla.amazon.com", "layla.amazon.co.uk"]
    }
    done(null, application)
});

app.get('/auth/start', oauthServer.authorize(function(applicationID, redirectURI, done){
    console.log("applicationID=" + applicationID)
    console.log("redirectURI=" + redirectURI);

    application = {
        title: "Name",
        oauth_id: "ahiotbjmbrtheoj",
        oauth_secret: "password",
        domains: ["pitangui.amazon.com", "alexa.amazon.co.jp", "layla.amazon.com", "layla.amazon.co.uk"]
    }

    done(null, application, redirectURI)
}), (req, res) => {

    res.render('auth', {
        transaction_id: req.oauth2.transactionID,
        scope: req.oauth2.req.scope,
        application: req.oauth2.client
    })
});

var options = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('cert.pem')
};
server = https.createServer(options, app);

const host = '0.0.0.0';
const port = 443

server.listen(port, host, function(){
	console.log('App listening on  %s:%d!', host, port);
});