var fs = require('fs');
var https = require('https');
var express = require('express');
var oauth2orize = require('oauth2orize'); 

var app = express();

var oauthServer = oauth2orize.createServer();

oauthServer.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    var code = utils.uid(2);
  
    var ac = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);
    ac.save(function(err) {
      if (err) { return done(err); }
      return done(null, code);
    });
  }));

app.get('/auth/start', oauthServer.authorize(function(applicationID, redirectURI, done){
    console.log("applicationID=" + applicationID)
    console.log("redirectURI=" + redirectURI);
}));

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