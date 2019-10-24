'use strict';
module.exports = function(app) {
	var blog = require('../controller/appController');

	//routes, express.route();
	app.route('/posts')
		.get(blog.recent)
		.put(blog.save);

	app.route('/post/:postID')
		.get(blog.read)
		.put(blog.save)
		.delete(blog.remove)

	app.route('/post/:postID/history')
		.get(blog.history)
};