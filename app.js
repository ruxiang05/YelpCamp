var express = require("express"),
              app = express(),
              bodyParser = require("body-parser"),
              mongoose = require("mongoose"),
              passport = require("passport"),
              LocalStrategy = require("passport-local"),
              User = require("./models/user"),
              Campground = require("./models/campground"),
              Comment = require("./models/comment"),
              seedDB = require("./seeds"),
              port = 3000 || process.env.PORT;


var commentsRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes = require("./routes/index");




mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//Passport setup
app.use(require("express-session")({
    secret:"YelpCamp secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/camgrounds/:id/comments', commentsRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//Indicates that server has started
app.listen(port, function(){
    console.log("YelpCamp has started!");
});
