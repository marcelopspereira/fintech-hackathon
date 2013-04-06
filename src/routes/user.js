// Used for determining info about the machine the server is running on.
var mongoose = require('mongoose'),
		generator = require('mongoose-gen'),
		validator = require(process.cwd()+'/src/validationFilter.js'),
		restify = require('restify');

generator.setConnection(mongoose); // Connect the schema generator to Mongoose.

//Load the JSON schema for the MongoDB user model.
var userSchema = require(process.cwd()+'/schemas/models/user.json');
var User = generator.schema('User',userSchema);

module.exports = function (server, db, packageManifest) {

	server.post({path: '/user', version: '1.0.0'}, function (req, res, next ) {
		//Verify that the request body has the proper format for a user post.
		result = validator.validateAgainstSchema(req, res, 'userPost');
		if(result === true)
		{
			//Fill in a few more properties.
			userData = req.body;
			userData.accountCreationDate = Math.floor(new Date().getTime()/1000);
			res.send(req.body);
		}
		return next();
	});

	server.get({path: '/user/:id', version: '1.0.0'}, function(req, res, next ) {
		res.send({'response': 'get user'});
		return next();
	});

};
