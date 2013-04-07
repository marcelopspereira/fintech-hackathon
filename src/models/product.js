var mongoose    = require('mongoose'),
		Schema      = mongoose.Schema,
		ObjectId    = mongoose.Types.ObjectId;

var schema = new mongoose.Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	name: String,
	description: String,
	price: Number,
	url: String
});

exports.model = mongoose.model('Product', schema);
