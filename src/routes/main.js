// Used for determining info about the machine the server is running on.
var os = require("os");

module.exports = function (server, db, packageManifest) {
	server.get({path: '/', version: '1.0.0'}, function(req, res, next ) {
		res.send({
			server: packageManifest.name,
			machine: os.hostname(),
			version: packageManifest.version
		});
		return next();
	});
};

