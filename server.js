//read .env from root
require('dotenv').config();

//define 
const 	express 	= require('express'),
		bodyParser 	= require('body-parser'),
		routes 		= require('./app/routes/appRoutes'),
		app 		= express(),
 		port 		= process.env.PORT || 3000; 

app.listen(port);

console.log('nodeBlog RESTful API server started on: '+port);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
 
routes(app);
 