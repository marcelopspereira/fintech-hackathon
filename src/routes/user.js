// Used for determining info about the machine the server is running on.
var	validator     = require(process.cwd()+'/src/validationFilter.js'),
		passwordHash  = require('password-hash'),
		User					= require(process.cwd()+'/src/models/user.js').model,
		S							= require('string');

module.exports = function (server, db, packageManifest, log) {

	server.post('/api/user', function (req, res) {
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
						return res.send(409, {
							'code': 'InvalidArgument',
							'message': 'The specified email address is already in use.'
						});
					}
					else
					{
						console.log(err);
					}
				}
				else
				{
					return res.send(200);
				}
			});
		}
	});

	server.get('/api/user/:id', function(req, res) {
		res.send({'response': 'get user'});
	});

};
