var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comments");

//Campgrounds Homepage
router.get("/",function(req,res){
	//Get all the campgrounds from db
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/campgrounds",{campgrounds : allcampgrounds});
		}
	});
});

//addition of new campground POST request
router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
	var desc = req.body.description;
    newCampground = {name : name , image : image , description : desc};
    //create a new campground & save in db
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			console.log("inserted to DB");
			res.redirect("/campgrounds");
		}
	})
});

//new Campground page
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


//SHOW - shows more info about campground
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground : foundCampground });	
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
