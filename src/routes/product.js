// Used for determining info about the machine the server is running on.
var	validator     = require(process.cwd()+'/src/validationFilter.js'),
		async					= require('async'),
		Product				= require(process.cwd()+'/src/models/product.js').model,
		sessionFilter = require(process.cwd()+'/src/sessionFilter.js'),
		mongoose      = require('mongoose'),
		assert				= require('assert'),
		ObjectId      = mongoose.Types.ObjectId;

module.exports = function (server, db, packageManifest, log) {

	//Add a new product for a user.
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

	//Get products owned by a user.
	server.get('/api/products', function (req, res) {
		sessionFilter.validate(req, res, function (userID) {
			if(userID===null)
			{
				return;
			}
			else
			{
				//Look up the objects owned by a user and return them.
				Product
					.find({user: userID})
					.exec(function (err, products) {
						if (err) return done(err);

						var responseProducts = [];
						products.forEach(function (product) {
							responseProducts.push({
								id: product._id,
								name: product.name,
								url: product.url,
								price: product.price,
								description: product.description
							});
						});
						res.send(responseProducts);
					});
			}
		});
	});

};
