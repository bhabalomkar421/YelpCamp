var mongoose = require("mongoose");

//connecting to database
// mongoose.connect("mongodb://localhost/yelp_camp");
require('dotenv').config();
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology: true });

//schema setup
var campgroundSchema = new mongoose.Schema({
	name : String,
	image : String,
	description : String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
			
		},
		username : String
	},
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]
});

module.exports = mongoose.model("Campground",campgroundSchema);
