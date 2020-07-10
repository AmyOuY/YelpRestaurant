var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");


// INDEX -- homepage shows all restaurants
router.get("/", function(req, res){
	var noMatch = null;
	if (req.query.search){
		var regexName = new RegExp(escapeRegExp(req.query.search), 'gi');
		Restaurant.find({name: regexName}, function(err, allRestaurants){
			if (err){
				console.log(err);
			}
			else{
				if (allRestaurants.length < 1){
					noMatch = "No Restaurant match the query, please search again!";
				}
				res.render("restaurants/index", {restaurants: allRestaurants, noMatch: noMatch});
			}
		});
	}
	else{	
		Restaurant.find({}, function(err, allRestaurants){
			if (err){
				console.log(err);
			}
			else{
				res.render("restaurants/index", {restaurants: allRestaurants, page: 'restaurants', noMatch: noMatch});
			}
		});
	}
});


// NEW -- show form to create new restaurant 
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("restaurants/new");
});


// CREATE -- create new restaurant and add it to mongoDB
router.post("/", middleware.isLoggedIn, function(req, res){
	var newRestaurant = req.body.restaurant;
	newRestaurant.author = {
		id: req.user._id,
		username: req.user.username
	}
	Restaurant.create(newRestaurant, function(err, newlyCreatedRestaurant){
		if (err){
			req.flash("error", "Something went wrong!");
			res.redirect("/restaurants");
		}
		else{
			req.flash("success", "Successfully added restaurant!");
			res.redirect("/restaurants");
		}
	});
});


// SHOW -- show more info about chosen restaurant
router.get("/:id", function(req, res){
	Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
		if (err){
			console.log(err);
		}
		else{
			res.render("restaurants/show", {restaurant: foundRestaurant});
		}
	});
});


// EDIT -- show form to edit chosen restaurant info
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
	Restaurant.findById(req.params.id, function(err, foundRestaurant){		
			res.render("restaurants/edit", {restaurant: foundRestaurant});
	});
});


// UPDATE -- update the info of chosen restaurant
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
	Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
		if (err){
			req.flash("error", "Something went wrong!");
			res.redirect("/restaurants");
		}
		else{
			req.flash("success", "Successfully updated restaurant!");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});


// DELETE -- delete chosen restaurants
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res){
	Restaurant.findByIdAndRemove(req.params.id, function(err){
		if (err){
			req.flash("error", "Something went wrong!");
			res.redirect("/restaurants");
		}
		else{
			req.flash("success", "Successfully deleted restaurant!");
			res.redirect("/restaurants");
		}
	});
});



function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


module.exports = router;