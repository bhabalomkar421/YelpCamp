var mongoose = require("mongoose");

//connecting to database
mongoose.connect("mongodb://localhost/yelp_camp");

//schema setup
var campgroundSchema = new mongoose.Schema({
	name : String,
	image : String,
	description : String,
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]
});

module.exports = mongoose.model("Campground",campgroundSchema);
