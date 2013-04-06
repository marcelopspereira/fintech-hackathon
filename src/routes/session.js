// Used for determining info about the machine the server is running on.
var	validator     = require(process.cwd()+'/src/validationFilter.js'),
		restify       = require('restify'),
		passwordHash  = require('password-hash'),
		Session				= require(process.cwd()+'/src/models/session.js').model;
		User					= require(process.cwd()+'/src/models/user.js').model;

module.exports = function (server, db, packageManifest, log) {

	server.post({path: '/session', version: '1.0.0'}, function (req, res, next ) {
		//Verify that the request body has the proper format for a user post.
		result = validator.validateAgainstSchema(req, res, 'sessionPost');
		if(result === true)
		{
			//Check to see if the email / password combo can be found.
			sessionLookup = req.body;
			hashedPassword = passwordHash.generate(sessionLookup.password);

			//Build the query to look up the user by their email address and password hash.
			var query = User.findOne({
				email: sessionLookup.email,
				password: hashedPassword
			});

			// Execute the query.
			query.exec(function (err, user) {
				console.log("response");
			});

			res.send({result: 'test'});

			return next();
		}
		else
		{
			return next();
		}
	});
};
