var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStategy = require("passport-local");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var metthodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");

var campgroundRoute = require("./routes/campgrounds");
var commentRoute = require("./routes/comments");
var authRoute = require("./routes/auth");

//connecting to database
// mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
require('dotenv').config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open',() => {
    console.log("MongoDB connection established");
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(metthodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
// seedDB();


//passport config
app.use(require("express-session")({
	secret : "monu",
	resave : false,
	saveUninitialized :false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/",authRoute);
app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id/comments",commentRoute);

app.listen("3000",function(){
    console.log("YelpCamp Server Started at port 3000");
});