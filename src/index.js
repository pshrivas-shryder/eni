var express = require('express');
var Twitter = require('twitter');
var app = express();

var client = new Twitter({
  consumer_key: 'FZUl0OfzBpmE7O2lNEBTRHO5j',
  consumer_secret: 'tKqz3qATAJz7EGMAX2OHMDnG6M1MREnf3WG9tK6EcunF45yw6Y',
  access_token_key: '4742496138-p5i8hV1XdLsrgXuG1tYroXVHhzYJleG9hQqr08B',
  access_token_secret: 'cObxsYcOZCrR7YqGdGmRmG9BxeHg9X94Ly9IFJXXJZMXW'
});
var params = {screen_name: 'Levis'};
var responseObj = {};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
	console.log(tweets);
	responseObj = tweets;
  }
});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/getLikesCount', function(request, response) {
	return response.json({
		status: 'OK',
		catalogues: {count : 10055},
    })
});

app.get('/IncrimentLikesCount', function(request, response) {
	return response.json({
		status: 'OK',
		catalogues: {count : 10055},
    })
});
app.get('/twitter', function(request, response) {
	return response.json({
		status: 'OK',
		catalogues: responseObj,
    })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


