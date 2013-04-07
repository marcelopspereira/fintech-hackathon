// Used for determining info about the machine the server is running on.
var	validator     = require(process.cwd()+'/src/validationFilter.js'),
		async					= require('async'),
		Product				= require(process.cwd()+'/src/models/product.js').model,
		sessionFilter = require(process.cwd()+'/src/sessionFilter.js'),
		mongoose      = require('mongoose'),
		assert				= require('assert'),
		ObjectId      = mongoose.Types.ObjectId;

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
					productData = req.body;
					productData.user = userID;

					var newProduct = new Product(productData);
					newProduct.save(function (err) {
						assert.ifError(err);
						res.send(productData);
					});
				}
			}
		});
	});

	server.get('/api/products', function (req, res) {

	})

};
