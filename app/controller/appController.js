'use strict';

var Post = require('../model/appModel.js');

exports.read = function(req, res) {
	Post.getByID(req.params.postID, function(err, post) {
		if(err)
			res.send(err);
		res.json(post);
	});
}

exports.recent = function(req, res) {
	Post.getRecent(req.params.numToGet, function(err, posts) {
		if(err)
			res.send(err);
		res.json(posts);
	});
}

exports.history = function(req, res) {
	if(isNaN(req.params.startRow))
		req.params.startRow = 0;
	Post.getHistoryByID(req.params.postID, req.params.startRow, function(err, posts) {
		if(err)
			res.send(err);
		res.json(posts);
	});
}

exports.save = function(req, res) {
	var post = new Post(req.body);
	Post.save(post, function(err, savePostRes) {
		if(err)
			res.send(err);
		res.json(savePostRes);
	});
}

exports.remove = function(req, res) {
	Post.remove(req.params.postID, function(err, removePostRes) {
		if(err) {
			res.send(err);
		} else {
			res.json(removePostRes);
		}
	});
} 