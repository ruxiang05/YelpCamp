var express = require("express"),
    router = express.Router({mergeParams: true}), // mergeParams - allows the access of the id when using routes
    Campground = require("../models/campground"),
    Comment  = require("../models/comment");

//Comments new
router.get("/new", isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err,campground){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
    });

});


//Comments create
router.post("/", function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/camgrounds");
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
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

module.exports = router;
