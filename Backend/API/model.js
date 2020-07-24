const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uid = require('uid2');

const ApplicationSchema = new Schema({
	title: { type: String, required: true },
	oauth_id: { type: Number, unique: true },
	oauth_secret: { type: String, unique: true, default: function() {
			return uid(64);
		}
	},
	domains: [ { type: String } ]
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = {Application};