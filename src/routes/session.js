// Used for determining info about the machine the server is running on.
var	validator     = require(process.cwd()+'/src/validationFilter.js'),
		restify       = require('restify'),
		async					= require('async'),
		passwordHash  = require('password-hash'),
		Session				= require(process.cwd()+'/src/models/session.js').model,
		User					= require(process.cwd()+'/src/models/user.js').model,
		crypto				= require('crypto');

module.exports = function (server, db, packageManifest, log) {

	server.post('/api/session', function (req, res) {
		//Verify that the request body has the proper format for a user post.
		result = validator.validateAgainstSchema(req, res, 'sessionPost');
		if(result === true)
		{
			//Check to see if the email / password combo can be found.
			//Build the query to look up the user by their email address and password hash.
			var query = User.findOne({
					email: req.body.email
				},
				function (err, user) {
					if(user === null)
					{
						res.send(409, {
							'code': 'InvalidArgument',
							'message': 'The user account was not found.'
						});
					}
					else
					{
						//Compare the password hash that we have with the password hash of the submitted password.
						if(passwordHash.verify(req.body.password, user.password))
						{
							//The login is correct. Generate a session token and save it in the session table.
							async.series({

									generateToken: function (callback) {
										crypto.randomBytes(48, function(ex, buf) {
											callback(null, buf.toString('hex'));
										});
									},

									saveSession: function (callback, token) {
										var sessionData = {
											user: user._id,
											application: req.body.application,
											token: token
										};

										//var newSession = new Session(sessionData);

										newSession.save(function (err) {
											res.send(sessionData);
											callback(null, true);
										});
									}
								},
								function (err, result) {
									if(result !== true)
									{
										log.error(result);
									}
								}
							);
						}
						else
						{
							res.send(409, {
								'code': 'InvalidArgument',
								'message': 'The user account was not found.'
							});
						}
					}
					res.send({err: err, user: user});
				}
			);
		}
	});
};
