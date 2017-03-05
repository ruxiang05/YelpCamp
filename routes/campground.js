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
    });
});

//NEW - show form to create new campground
router.get("/new",isLoggedIn, function(req,res){
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
router.post("/",isLoggedIn, function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
      id: req.user._id,
      username : req.user.username
    };
    var newCampground = {name:name, image:image, description:description, author: author};
    //Create a new campgroudn and save to DB
    Campground.create(newCampground, function(err,newCamp){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
    });

});

//EDIT campground
router.get('/:id', checkCamgroundOwnership, (req,res) => {
    Campground.findById(req.params.id, (err,foundCampground) => {
      res.render('campgrounds/edit', {campground:foundCampground});
    });
});
//UPDATE campground

router.put('/:id', checkCamgroundOwnership, (req,res) => {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.body.id, req.body.campground, function(err,updatedCamground){
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('campgrounds/' + req.params.id);
    }
  });

});

//DESTROY campground
router.delete('/:id', checkCamgroundOwnership, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect('/campgrounds');
      }else{
        res.redirect('/campgrounds');
      }
    })
});
//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

function checkCamgroundOwnership(req,res,next){
  router.get('/:id/edit', (req,res) => {
    //is user logged in?
    if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
          if(err){
            res.redirect('back');
          } else {
            //does it own the campground?
            if(foundCampground.author.id.equals(req.user._id)){
              next();
            } else {
              res.redirect('back');
            }

          }
      });
    } else {
      res.redirect('back');
    }
}

module.exports = router;
