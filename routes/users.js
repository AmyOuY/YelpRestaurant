var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// show landing homepage
router.get("/", function(req, res){
	res.render("users/landing");
});



// show sign-up form
router.get("/register", function(req, res){
	res.render("users/register", {page: 'register'});
});


// handle sign-up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if (req.body.adminCode == "ThisIsSecreteAdminCode"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if (err){
			console.log(err);
			res.render("users/register", {error: err.message});
		}
		else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpRestaurant " + user.username);
				res.redirect("/restaurants");
			});
		}
	});
});



// show login form
router.get("/login", function(req, res){
	res.render("users/login", {page: 'login'});
});



// handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/restaurants",
	failureRedirect: "/login"
}), function(req, res){
	
});



// handle logout logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully log you out!");
	res.redirect("/restaurants");
});



module.exports = router;