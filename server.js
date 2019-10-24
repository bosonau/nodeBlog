const 	express 	= require('express'),
		app 		= express(),
		bodyParser 	= require('body-parser'),
 		port 		= process.env.PORT || 3000;

require('dotenv').config();


app.listen(port);
console.log('nodeBlog RESTful API server started on: '+port);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var routes = require('./app/routes/appRoutes');
routes(app);
