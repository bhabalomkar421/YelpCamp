var mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/yelp_camp");
require('dotenv').config();
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology: true });

//schema setup
var commentSchema = new mongoose.Schema({
	text : String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	}
});

module.exports = mongoose.model("Comment",commentSchema);
