var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments")

var data = [
	{
	name : "goa",
	image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58GICDuMD9O5RtrayrnO2BHky9Vq94d28Ljq1UyzxydyNXibU&s",
	description : "this is cool place"
	},
	{name : "goa",
	image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58GICDuMD9O5RtrayrnO2BHky9Vq94d28Ljq1UyzxydyNXibU&s",
	description : "this is cool place"
	},
	{name : "goa",
	image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58GICDuMD9O5RtrayrnO2BHky9Vq94d28Ljq1UyzxydyNXibU&s",
	description : "this is cool place"
	}];
function seedDB(){
	Campground.remove({},function(err){
		if(err){
			console.log(err)
		}
		console.log("removed campgrounds");
		data.forEach(function(seed){
			Campground.create(seed,function(err,campground){
				if(err){
					console.log(err);
					}
				else{
					console.log("newly created campground");
					Comment.create({
						text : "This is cool place",
						author : "Omkar"
						},function(err,comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("created new comment");
							}
						})
					}
				});
			});
		});		
	}

module.exports = seedDB;