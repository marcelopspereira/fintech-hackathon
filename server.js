//Static JSON data files.
var packageManifest = require('./package.json'),
		config = require('./config');

// Core package requirements.
var express = require("express"),
		async = require('async'),					// For doing async stuff.
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

			if(process.env.OPENSHIFT_MONGODB_DB_URL!==undefined)
			{
				log.info('Connecting to OpenShift MongoDB cartridge...');
				connectionString = process.env.OPENSHIFT_MONGODB_DB_URL;
			}
			else
			{
				log.info('Connecting to local MongoDB...');
				connectionString = config.mongodb; //Use the connection string loaded from local config file.
			}

			mongoose.connect(connectionString),
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

			try
			{
				var app = express();

				app.configure(function () {
					app.use(express.bodyParser());
					app.use(express.methodOverride());
					app.use(app.router);
					app.use(express.static(__dirname+'/public'));
					app.use(function (err, req, res, next) {
						log.error(err);
					});
				});

				//Create the routes.
				var routes = [
					require('./src/routes/main.js')(app, db, packageManifest, log),
					require('./src/routes/user.js')(app, db, packageManifest, log),
					require('./src/routes/session.js')(app, db, packageManifest, log),
					require('./src/routes/product.js')(app, db, packageManifest, log)
				];

				app.listen(8080, function (server) {
					log.info("Server started and listening.");
				});
			}
			catch(e)
			{
				console.log(e);
			}
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



