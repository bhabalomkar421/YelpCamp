var express = require("express");
var router = express.Router();
var passport = require("passport");
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var User = require("../models/user");

//Route for HomePage
router.get("/",function(req,res){
    res.render("landing");
});

//get registration form route
router.get("/register",function(req,res){
	res.render("register");
})

//post register form route
router.post("/register",function(req,res){
	var newUser = new User({username : req.body.username});
	User.register(newUser,req.body.password , function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		});
	})
});

// get login form 
router.get("/login",function(req,res){
	res.render("login");
});

//loin post route
router.post("/login",passport.authenticate("local",
	{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
	})
	,function(req,res){
	
});

//logout route
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");
});

//middleware 
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;
