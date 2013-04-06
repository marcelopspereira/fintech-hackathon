var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	user: String,
	name: String,
	description: String,
	price: Number,
	url: String
});

exports.model = mongoose.model('Product', schema);
