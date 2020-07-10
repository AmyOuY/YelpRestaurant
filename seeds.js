var moongoose = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment");

var data = [
	{
		name: "Sichuan Pepper",
		image: "https://www.photosforclass.com/download/pb_4018869",
		flavor: "spicy, Chengdu, hot pot",
		address: "180 Lincol Street, Summerhill, Montreal, QC, H2H4F9",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
	},
	{
		name: "Chongqing Yangzt Hotpot",
		image: "https://www.photosforclass.com/download/pb_3874137",
		flavor: "spicy, Chongqing, hot pot",
		address: "396 Relly Street, Villa, Montreal, QC, H3G2G1",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
	},
	{
		name: "Hongkong Hotpot",
		image: "https://www.photosforclass.com/download/pb_2753998",
		flavor: "non-spicy, Hongkong, hot pot",
		address: "1200 Forest Avenue, Camppton, Montreal, QC, H5E3S2",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
	}
]


function seedDB(){
	Restaurant.remove({}, function(err){
		if (err){
			console.log(err);
		}
		else{
			console.log("Deleted all restaurants in mongoDB");
			data.forEach(function(info){
				Restaurant.create(info, function(err, newlyCreatedRestaurant){
					if (err){
						console.log(err);
					}
					else{
						console.log("Added a new restaurent");
						Comment.create({
							text: "Greate taste of hotpot. A variety of meats and vegetable that suits everybody's preference. Cheap and good-quality of food.",
							author: "Elly"
						}, function(err, comment){
							if (err){
								console.log(err);
							}
							else{
								newlyCreatedRestaurant.comments.push(comment);
								newlyCreatedRestaurant.save();
								console.log("created new comment");
							}
						});
					}
				});
			});
		}
	});
}


module.exports = seedDB;