var https = require('https');
var express = require('express');
var oauth2orize = require('oauth2orize'); 

var app = express();

var oauthServer = oauth2orize.createServer();

app.get('/auth/start', oauthServer.authorize(function(applicationID, redirectURI, done){
    console.log("applicationID=" + applicationID)
    console.log("redirectURI=" + redirectURI);
}));

var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};
server = https.createServer(options, app);

server.listen(443, '0.0.0.0', function(){
	console.log('App listening on  %s:%d!', host, port);
});