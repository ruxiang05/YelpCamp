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
                    //Add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //Save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })

});
//Edit
router.get('/:comment_id/edit', checkCommmentOwnership,(req,res) => {
    Comment.findById(req.params.comment_id, function(err,foundComment){
      if(err){
        res.redirect('back');
      } else {
        res.render('comments/edit', {campground_id:req.params.id, comment:foundComment});
      }
    });
});

//Update
router.put('/:comment_id', checkCommmentOwnership, (req,res) => {
   Comment.findByIdAndUpdate(req.params.comment_id, req.params.comment, function(err, updatedComment){
      if(err){
        res.redirect('back');
      } else {
        res.redirect('/campgrounds/' + req.params.id);
      }
   });
});

//Destroy
router.delete('/:comment_id', checkCommmentOwnership,(req,res) => {
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

function checkCommmentOwnership(req,res,next){
  router.get('/:id/edit', (req,res) => {
    //is user logged in?
    if(req.isAuthenticated()){
      Comment.findById(req.params.id, function(err, foundComment){
          if(err){
            res.redirect('back');
          } else {
            //does it own the campground?
            if(foundComment.author.id.equals(req.user._id)){
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
