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


//Route for HomePage
app.get("/",function(req,res){
    res.render("landing");
});

//Campgrounds Homepage
app.get("/campgrounds",function(req,res){
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
app.post("/campgrounds",isLoggedIn,function(req,res){
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
app.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


//SHOW - shows more info about campground
app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground : foundCampground });	
		}
	});
});

//==============COMMENT ROUTE ================
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground : campground });
		}
	});	
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	})
});


//==========Auth Route ==================
app.get("/register",function(req,res){
	res.render("register");
})

app.post("/register",function(req,res){
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

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",
	{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
	})
	,function(req,res){
	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//-----------PAGE NOT FOUND-----------------
app.get("*",(req,res)=>{
	res.send("Page not found");
});


app.listen("3000",function(){
    console.log("YelpCamp Server Started at port 3000");
});