var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose"),
	seedDB = require("./seeds"),
	Restaurant = require("./models/restaurant"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");


app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.set("view engine", "ejs");
app.locals.moment = require("moment");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost/yelpRestaurantApp");

//seedDB();

app.use(require("express-session")({
	secret: "This is my secrete key so please do not tell others",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var restaurantRoutes = require("./routes/restaurants"),
	commentRoutes = require("./routes/comments"),
	userRoutes = require("./routes/users");


// function called on every single route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The Yelp Restaurant App has started");
});