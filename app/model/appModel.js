'user strict';
const dbConnection = require('./db.js');

//post Obj
const Post = function(post) { 
	this.ID 				= post.ID;
	this.title 				= post.title;
	this.createdOn			= post.createdOn;
	this.createdBy			= post.createdBy;
	this.isDeleted			= post.isDeleted;
	this.postVersionID 		= post.postVersionID;
	this.content 			= post.content;
	this.lastEditedOn		= post.lastEditedOn;
	this.lastEditedBy 		= post.lastEditedBy;
}

Post.save = function(post, result) {
	if(isNaN(post.ID))
		post.ID = 0;
	const sql =
		'SET @ID = ?, @title = ?, @userID = ? , @content = ?; '+
		'CALL insertOrUpdatePost(@ID, @title, @userID, @postID); '+
		'INSERT INTO postversion (postID, createdBy, content) '+
		'VALUES (@postID, @userID, @content); '+
		'SET @postversionID = LAST_INSERT_ID(); '+
		'UPDATE postversion SET isOld = 1 WHERE postID = @postID AND ID != @postversionID; '+
		'SELECT	p.ID, p.title, p.createdOn, p.createdBy, p.isDeleted, pv.ID as postVersionID, pv.content, pv.createdOn as lastEditedOn, pv.createdBy as lastEditedBy, pv.isOld FROM	postversion as pv inner join post as p on pv.postID = p.ID WHERE pv.ID = @postversionID;';
	const params = [
		post.ID,
		post.title,
		post.createdBy,
		post.content
	]	
	dbConnection.query(sql, params, function(err, res, fields) {
		if(err) {
			console.log('err :', err);
			result(err, null);
		} else {
			const insertedRecord = res[res.length-1];
			result(null, insertedRecord);
		}
	});
}

Post.getByID = function(id, result) {
	var sql = 
		'SELECT 	P.ID, P.title, P.createdOn, P.createdBy, P.isDeleted, '+
		'			PV.ID as postVersionID, PV.content, PV.createdOn as lastEditedOn, PV.createdBy as lastEditedBy '+
		'FROM 		post as P INNER JOIN '+
		'			postversion as PV on P.ID = PV.postID '+
		'WHERE 		P.ID = ? AND P.isDeleted = 0 AND PV.isOld = 0 '+
		'ORDER BY 	PV.createdOn DESC '+
		'LIMIT 		1';
	dbConnection.query(sql, [id], function(err, res, fields) {
		if(err) {
			console.log('err :', err);
			result(err, null);
		} else {
			result(null, res);
		}
	});
}
 
Post.getRecent = function(numToGet, result) {
	if(isNaN(numToGet))
		numToGet = 5;
	var sql = 
		'SELECT P.ID, P.title, P.createdOn, P.createdBy, P.isDeleted, '+
		'PV.ID as postVersionID, PV.content, PV.createdOn as lastEditedOn, PV.createdBy as lastEditedBy '+
		'FROM post as P INNER JOIN postversion as PV on P.ID = PV.postID '+
		'WHERE P.isDeleted = 0 AND PV.isOld = 0 '+
		'ORDER BY P.createdOn DESC, PV.createdOn DESC '+
		'LIMIT 0, '+dbConnection.escape(numToGet);
	dbConnection.query(sql, [numToGet], function(err, res, fields) {
		if(err) {
			console.log('err :', err);
			result(err, null);
		} else {
			result(null, res);
		}
	});
}

Post.getHistoryByID = function(id, startRow, result) {
	if(isNaN(startRow))
		startRow = 0;
	var sql = 
		'SELECT P.ID, P.title, P.createdOn, '+
		'PV.ID as postVersionID, PV.content, PV.createdOn as lastEditedOn, PV.createdBy as lastEditedBy '+
		'FROM post as P INNER JOIN postversion as PV on P.ID = PV.postID '+
		'WHERE P.ID = ? AND P.isDeleted = 0 '+
		'ORDER BY P.createdOn DESC, PV.createdOn DESC LIMIT '+dbConnection.escape(startRow)+' , 10';	
	dbConnection.query(sql, [id], function(err, res, fields) {
		if(err) {
			console.log('err :', err);
			result(err, null);
		} else {
			result(null, res);
		}
	});
}

Post.remove = function(postID, result) {
	if(isNaN(postID))
		postID = 0;
	var sql ='UPDATE post SET isDeleted = 1 WHERE ID = ?; SELECT ROW_COUNT() as deletedRows;';
	dbConnection.query(sql, [postID], function(err, res, fields) {
		if(err) {
			console.log('err :', err);
			result(err, null);
		} else {
			const deletedRows = res[res.length-1].deletedRows;
			result(null, deletedRows);
		}
	});
}

module.exports = Post;