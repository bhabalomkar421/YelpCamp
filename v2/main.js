var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStategy = require("passport-local");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");

var campgroundRoute = require("./routes/campgrounds");
var commentRoute = require("./routes/comments");
var authRoute = require("./routes/auth");
//connecting to database
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
seedDB();


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
	next();
})

// Campground.create(
// 	{
// 	name : "goa",
// 	image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58GICDuMD9O5RtrayrnO2BHky9Vq94d28Ljq1UyzxydyNXibU&s",
// 	description : "this is cool place"
// 	},function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("newly created campground");
// 		console.log(campground);
// 	}
// });


// var campgrounds = [
//     {name : "ladakh",image : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Shyok_river_ladahak.jpg/280px-Shyok_river_ladahak.jpg"},
//     {name : "leh",image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJUajgSYEXuD0JfnTW35MbwKrjj6JnxfdYBHM9fOcpEGm2o7-dSA&s"},
//     {name : "goa",image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58GICDuMD9O5RtrayrnO2BHky9Vq94d28Ljq1UyzxydyNXibU&s"}
// ];

app.use("/",authRoute);
app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id/comments",commentRoute);

app.listen("3000",function(){
    console.log("YelpCamp Server Started at port 3000");
});