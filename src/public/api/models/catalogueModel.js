const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catalogueModel = new Schema({
	desc: {
		type: String,
		unique: true,
		required: true,
	},
    image: {
        type: String,
        unique: true,
        required: true,
    },
	subCatalogue: [{
	desc: {
		type: String,
		unique: true,
		required: true,
	},
    image: {
        type: String,
        unique: true,
        required: true,
    }
	}],
},
{ timestamps: true }
);

module.exports = mongoose.model('catalogueModel', catalogueModel);
