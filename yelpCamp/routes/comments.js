var express = require("express");
var router = express.Router({mergeParams : true });
var middleware = require("../middleware");
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var User = require("../models/user");


//==============COMMENT new ================
router.get("/new", middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground : campground });
		}
	});	
});

//==============COMMENT create ================
router.post("/", middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went Wrong!!!");
					console.log(err);
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment...");
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	})
});

//comment edit route
 router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	 Comment.findById(req.params.comment_id,function(err,foundComment){
		 if(err){
			 console.log(err);
			 res.redirect("/campgrounds/"+req.params.id);
		 }else{
			res.render("comments/edit",{campground_id : req.params.id , comment : foundComment});
		 }
	 });
 });

//comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		 if(err){
			 console.log(err);
			 res.redirect("/campgrounds/"+req.params.id);
		 }else{
			
			res.redirect("/campgrounds/"+req.params.id);
		 }
	 });
})

//delete comment route
router.delete("/:comment_id", middleware.checkCommentOwnership , function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds/"+req.params.id);
		}else{
			req.flash("success","Comment deleted Successfully...");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});


module.exports = router;