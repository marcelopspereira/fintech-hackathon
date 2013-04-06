var mongoose      = require('mongoose');

var schema = new mongoose.Schema({
	application: String,
	userID: String,
	token: String,
	time: {
		type: Date,
		default: Date.now
	}
});

exports.model = mongoose.model('Session', schema);
