// Used for determining info about the machine the server is running on.
var	validator     = require(process.cwd()+'/src/validationFilter.js'),
		restify       = require('restify'),
		passwordHash  = require('password-hash'),
		User					= require(process.cwd()+'/src/models/user.js').model,
		S							= require('string');

module.exports = function (server, db, packageManifest, log) {

	server.post({path: '/user', version: '1.0.0'}, function (req, res, next ) {
		//Verify that the request body has the proper format for a user post.
		result = validator.validateAgainstSchema(req, res, 'userPost');
		if(result === true)
		{
			//Fill in a few more properties.
			userData = req.body;
			userData.password = passwordHash.generate(userData.password);

			var newUser = new User(userData);

			newUser.save(function (err) {
				if(err)
				{
					if(S(err.err).contains('duplicate key'))
					{
						return next(new restify.InvalidArgumentError("Email address already in use."));
					}
					else
					{
						console.log(err);
					}
				}
				else
				{
					res.send(userData);
					return next();
				}
			});
		}
	});

	server.get({path: '/user/:id', version: '1.0.0'}, function(req, res, next ) {
		res.send({'response': 'get user'});
		return next();
	});

};
