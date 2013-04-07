var mongoose = require('mongoose'),
		Schema      = mongoose.Schema,
		ObjectId    = mongoose.Types.ObjectId;

var schema = new mongoose.Schema({
	application: String,
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	token: String,
	time: {
		type: Date,
		default: Date.now
	}
});

exports.model = mongoose.model('Session', schema);
