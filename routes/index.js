var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//Route route
router.get('/', (req,res) => {
  res.render('landing');
}

//Register form route
router.get("/register", function(req, res) {
   res.render('register');
});

//handling register route
router.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
   User.register(newUser, req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render('register');
       }

       passport.authenticate('local')(req,res,function(){
           res.redirect('/campgrounds');
       });
   });
});

//Login route
router.get('/login', function(req, res) {
    res.render('login');
});

//handle login
router.post('/login',passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: 'login'
        }), function(req, res) {
});

//logout route
router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/campgrounds');
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

module.exports = router;
