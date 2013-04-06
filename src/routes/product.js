// Used for determining info about the machine the server is running on.
var	validator     = require(process.cwd()+'/src/validationFilter.js'),
		async					= require('async'),
		passwordHash  = require('password-hash'),
		Session				= require(process.cwd()+'/src/models/session.js').model,
		User					= require(process.cwd()+'/src/models/user.js').model,
		crypto				= require('crypto'),
		sessionFilter = require(process.cwd()+'/src/sessionFilter.js');

module.exports = function (server, db, packageManifest, log) {

	server.post('/api/product', function (req, res) {
		sessionFilter.validate(req, res, function (userID) {
			if(userID===null)
			{
				return;
			}
			else
			{
				result = validator.validateAgainstSchema(req, res, 'productPost');
				if(result === true)
				{
					res.send(req.body);
				}
			}
		});
	});

};
