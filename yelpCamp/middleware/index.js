var Campground = require("../models/campground");
var Comment = require("../models/comments");


//all middleware 
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login first");
	res.redirect("/login");
}


middlewareObj.checkCampgroundOwnership = function(req,res,next){
	//is user logged in 
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("/");
			}else{
				//does user own that campground
				if(foundCampground.author.id.equals(req.user._id)){
				   next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("/");
				}
			}
		});
	}else{
		req.flash("error","Please Login first");
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	//is user logged in 
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error","Comment not found");
				res.redirect("/campgrounds");
			}else{
				//does user own that campground
				if(foundComment.author.id.equals(req.user._id)){
				   next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("/campgrounds");
				}
			}
		});
	}else{
		req.flash("error","Please Login first");
		res.redirect("/login")
	}
}

module.exports = middlewareObj;