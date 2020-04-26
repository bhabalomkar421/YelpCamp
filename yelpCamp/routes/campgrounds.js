var express = require("express");
var router = express.Router({mergeParams : true });
var mongoose = require("mongoose");
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//to fix deprecated warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
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
router.post("/", middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id : req.user._id,
		username : req.user.username
	}
    newCampground = {name : name , image : image , description : desc, author : author};
	
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
router.get("/new", middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});



//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/edit",{campground : foundCampground});
		}
	});
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});


//Delete campground route Destroy route 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

//SHOW - shows more info about campground
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground : foundCampground });	
		}
	});
});


module.exports = router;
