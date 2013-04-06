// Used for determining info about the machine the server is running on.
var os = require("os");

module.exports = function (server, db, packageManifest, log) {
	server.get('/api', function(req, res) {
		res.send({
			server: packageManifest.name,
			machine: os.hostname(),
			version: packageManifest.version
		});
	});
};

