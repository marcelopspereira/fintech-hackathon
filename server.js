var express = require("express");
  var app = express();

app.use(express.static(__dirname+'/public'));

app.listen(1337);

//Static JSON data files.
var packageManifest = require('./package.json'),
		config = require('./config');

// Some core package requirements.
var async = require('async'),					// For doing async stuff.
		restify = require('restify'),			// REST API framework.
		bunyan = require('bunyan'),				// Logging framework.
		mongoose = require('mongoose'),		// MongoDB framwork.
		fs = require('fs');

//Make sure that the log folder exists.
try {
	stats = fs.lstatSync(process.cwd()+'/logs');
}
catch (e) {
	fs.mkdirSync(process.cwd()+'/logs');
}

//Make sure that the log folder exists.
try {
	stats = fs.lstatSync(process.cwd()+'/logs');
	if(!stats.isDirectory()) {
		fs.mkdirSync(process.cwd()+'/logs');
	}
}
catch (e) {
	console.log("Could not create the /logs folder, please create it manually.");
}

//Create the logging interface
var log = bunyan.createLogger({
	name: packageManifest.name,
	streams: [
		{
			level: 'info',
			stream: process.stdout           // log INFO and above to stdout
		},
		{
			level: 'error',
			path: './logs/' + packageManifest.name + '-error.log'  // log ERROR and above to a file
		}
	]
});

// Load process by setting up all the required components to run this API.
async.series({

    mongoose: function(callback){
			log.info('Connecting to MongoDB...');

			mongoose.connect(config.mongodb),
			db = mongoose.connection;

			//If the connection fails.
			db.on('error', function ()
			{
				var errorMessage = 'Failed to connect to MongoDB. Check the configuration settings.';
				log.error(errorMessage);
				callback(errorMessage, false);
			});

			//If the connection succeeds.
			db.once('open', function () {
				log.info('Connected to MongoDB successfully.');
				callback(null, true);
			});
    },

    restify: function(callback){
			log.info('Creating server...');

			var server = restify.createServer({
				name: packageManifest.name,
				version: packageManifest.version,
				log: log
			});

			//Attach some extra components to the server.
			server.use(restify.gzipResponse());  //Gzip support
			server.use(restify.bodyParser({ mapParams: false }));    //Parse a variety of different incoming POST body formats.

			//Create the routes.
			var routes = [
				require('./src/routes/main.js')(server, db, packageManifest, log),
				require('./src/routes/user.js')(server, db, packageManifest, log),
				require('./src/routes/session.js')(server, db, packageManifest, log)
			];

			server.listen(8080, function () {
				log.info(server.name+' listening at '+server.url);
				callback(null, true);
			});

			server.on('after', restify.auditLogger({
					log: bunyan.createLogger({
					name: 'audit',
					stream: process.stdout
				})
			}));

			server.on('uncaughtException', function (request, response, route, error) {
				log.info('Uncaught exception on request '+request+'\n'+error);
				response.send(new restify.InternalError('Uncaught Exception: '+error));
			});

			server.on('error', function (error) {
				log.info('Uncaught error '+error);
			});
    }

},
function(err, startupComponents) {
	var success = true;
	for(var component in startupComponents)
	{
		if(startupComponents[component]===false)
			success = false;
	}
	if(success===true)
		log.info('Process loaded successfully.');
	else
		log.error("Unable to continue. Some components failed to start.",startupComponents);
});
