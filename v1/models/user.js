var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//connecting to database
mongoose.connect("mongodb://localhost/yelp_camp");

var UserSchema = new mongoose.Schema({
	username : String,
	password : String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);