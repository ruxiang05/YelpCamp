var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

//INDEX - show all campgrounds

router.get("/", function(req,res){

    //Get all campgrounds from the DB
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log("Error");
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    })
});
//NEW - show form to create new campground
router.get("/new", function(req,res){
    res.render("campgrounds/new");
});
//Show - shows more details about that campground
router.get("/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
          console.log(err);
      } else {
          console.log(foundCampground);
          res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});
//CREATE - add new campground to DB
router.post("/", function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name, image:image, description:description};
    //Create a new campgroudn and save to DB
    Campground.create(newCampground, function(err,newCamp){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
    });

});

module.exports = router;
