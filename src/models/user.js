var mongoose      = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		unique: true
	},
	password:   String,
	accountCreationDate: {
		type: Date,
		default: Date.now
	}
});

exports.model = mongoose.model('User', schema);
