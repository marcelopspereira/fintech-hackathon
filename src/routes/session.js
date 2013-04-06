// Used for determining info about the machine the server is running on.
var mongoose      = require('mongoose'),
		generator     = require('mongoose-gen'),
		validator     = require(process.cwd()+'/src/validationFilter.js'),
		restify       = require('restify'),
		passwordHash  = require('password-hash');

generator.setConnection(mongoose); // Connect the schema generator to Mongoose.

//Load the JSON schema for the MongoDB user model.
var sessionSchema = require(process.cwd()+'/schemas/models/user.json');
var Session = generator.schema('Session',sessionSchema);

module.exports = function (server, db, packageManifest, log) {

	server.post({path: '/user', version: '1.0.0'}, function (req, res, next ) {
		//Verify that the request body has the proper format for a user post.
		result = validator.validateAgainstSchema(req, res, 'sessionPost');
		if(result === true)
		{
			//Fill in a few more properties.
			userData = req.body;
			userData.accountCreationDate = Math.floor(new Date().getTime()/1000);
			userData.password = passwordHash.generate('password123');

			var newUser = new User(userData);
			newUser.save(function (err) {
				if(err)
					log.error(err);
			});
			res.send(userData);
		}
		return next();
	});

	server.get({path: '/user/:id', version: '1.0.0'}, function(req, res, next ) {
		res.send({'response': 'get user'});
		return next();
	});

};
