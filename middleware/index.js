var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var User = require("../models/user");

var middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next){
	if (req.isAuthenticated()){
		Restaurant.findById(req.params.id, function(err, foundRestaurant){
			if (err){
				req.flash("error", "Restaurant not found!");
				res.redirect("back");
			}
			else{
				if (!foundRestaurant){
					req.flash("error", "Restaurant not found!");
					return res.redirect("back");
				}				
				if (foundRestaurant.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}
				else{
					req.flash("error", "You do not have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}



middlewareObj.checkCommentOwnership = function(req, res, next){
	if (req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err){
				req.flash("error", "Comment not found!");
				res.redirect("back");
			}
			else{
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}
				else{
					req.flash("error", "You do not have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}



middlewareObj.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()){
		next();
	}
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
}


module.exports = middlewareObj;