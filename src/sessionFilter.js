var Session	= require(process.cwd()+'/src/models/session.js').model;

module.exports = {
	validate : function (req, res, callback) {
		var query = Session.findOne({
			application: req.headers.application,
			token: req.headers.token
		},
		function (err, session) {
			if(err)
			{
				res.send(409, {
					'code': 'InvalidArgument',
					'message': 'Session is invalid.'
				});
				callback(false);
			}
			else
			{
				if(!session)
				{
					res.send(409, {
						'code': 'InvalidArgument',
						'message': 'Session is invalid.'
					});
					callback(false);
				}
				else
				{
					callback(session._id);
				}
			}
		});
	}
};
