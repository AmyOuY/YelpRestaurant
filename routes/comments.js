var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// NEW -- show form to add new comment to chosen restaurant
router.get("/new", middleware.isLoggedIn, function(req, res){
	Restaurant.findById(req.params.id, function(err, foundRestaurant){
		if (err){
			console.log(err);
		}
		else{
			res.render("comments/new", {restaurant: foundRestaurant});
		}
	});
});



// CREATE -- add new comment to chosen restaurant
router.post("/", middleware.isLoggedIn, function(req, res){
	Restaurant.findById(req.params.id, function(err, foundRestaurant){
		if (err){
			req.flash("error", "Something went wrong!");
			res.redirect("/restaurants");
		}
		else{
			Comment.create(req.body.comment, function(err, newlyCreatedComment){
				if (err){
					req.flash("error", "Something went wrong!");
					res.redirect("back");
				}
				else{
					newlyCreatedComment.author.id = req.user._id;
					newlyCreatedComment.author.username = req.user.username;
					newlyCreatedComment.save();
					foundRestaurant.comments.push(newlyCreatedComment);
					foundRestaurant.save();
					req.flash("success", "Successfully added comment!");
					res.redirect("/restaurants/" +foundRestaurant._id);
				}
			});
		}
	});
});



// EDIT -- show form to edit specific comment of chosen restaurant
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
		}
	});
});



// UPDATE -- update specific comment of chosen restaurant
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err){
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		}
		else{
			req.flash("success", "Successfully updated comment!");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});



// DELETE -- delete specific comment of chosen restaurant
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		}
		else{
			req.flash("success", "Successfully deleted comment!");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});



module.exports = router;