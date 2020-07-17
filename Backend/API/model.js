const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uid = require('uid2');

const ApplicationSchema = new Schema({
	title: { type: String, required: true },
	oauth_id: { type: Number, unique: true },
	oauth_secret: { type: String, unique: true, default: function() {
			return uid(32);
		}
	},
	domains: [ { type: String } ]
});

const AccessTokenSchema = new Schema({
	nonce: { type: String, unique: true, required: true },
	application: { type: Number,unique:true,required:true},
});

const Application = mongoose.model('Application', ApplicationSchema);
const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = {Application,AccessToken};