var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//connecting to database
// mongoose.connect("mongodb://localhost/yelp_camp");
require('dotenv').config();
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology: true });

var UserSchema = new mongoose.Schema({
	username : String,
	password : String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);