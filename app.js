const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Import the User and Movie models
const User = require('./models/user');
const Movie = require('./models/movie');
const Comment = require('./models/comment');
const Rating = require('./models/rating');
const CommentRating = require('./models/commentRating');

// Use body-parser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({
    secret: 'project secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1/imdb-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to the MongoDB database');
    })
    .catch((err) => {
        console.log('Error connecting to the MongoDB database:', err);
    });

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const path = require('path');
const url = require('url');

const appdir = __dirname;
const appdirPath = url.fileURLToPath(
  'file://' + path.join(appdir, 'app.js')
);
const staticPath = path.join(appdir, 'views');

app.use(express.static(staticPath));



app.get("/", async function(req, res){
    res.render("home");
})

app.get("/login", async function(req, res){
    res.render("login");
})

app.get("/register", async function(req, res){
    res.render("register");
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

async function getAverageRating(movie) {
    const ratings = await Rating.find({ movie: movie._id });
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0);
    return sum / ratings.length;
}

app.get("/movies", async function (req, res) {
    try {
        const foundMovies = await Movie.find().sort({ _id: 1 }).limit(100).populate('comments');
        for (const movie of foundMovies) {
            movie.averageRating = await getAverageRating(movie);
        }
        console.log(foundMovies);
        res.render('movies', { movies: foundMovies });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/users", async function (req, res) {
    try {
        const foundUsers = await User.find();
        console.log(foundUsers);
        res.send(foundUsers);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/movies/filter", isAuthenticated, async function (req, res) {
    try {
        const startYear = req.query.startYear ? parseInt(req.query.startYear) : null;
        const runtimeMinutes = req.query.runtimeMinutes ? parseInt(req.query.runtimeMinutes) : null;

        if ((startYear === null && runtimeMinutes === null) || (isNaN(startYear) && isNaN(runtimeMinutes))) {
            res.status(400).send("At least one filter (startYear or runtimeMinutes) must be provided.");
            return;
        }

        const filters = {
            startYear: isNaN(startYear) ? null : startYear,
            runtimeMinutes: isNaN(runtimeMinutes) ? null : runtimeMinutes,
        };

        const foundMovies = await Movie.findByFilters(filters);
        for (const movie of foundMovies) {
            movie.averageRating = await getAverageRating(movie);
        }
        console.log(foundMovies);
        res.render('movies', { movies: foundMovies });
        
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/register", async function (req, res) {
    const username = req.body.username;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        res.send("A user with this email/username already exists.");
    } else {
        User.register({
            username: req.body.username
        }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.send("Error registering new user. Please try again.");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/movies");
                    
                })
                
            }
        })
    }

})

app.post('/login', async function (req, res, next) {
    
    try {
        const foundUser = await User.findOne({ username: req.body.username });

        if (foundUser) {
            const user = new User({
                username: req.body.username,
                password: req.body.password,
            });

            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                if (!user) {
                    return res.send('Wrong Password!');
                }
                req.login(user, function (err) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }
                    return res.redirect("/movies");
                });
            })(req, res, next);
        } else {
            res.send('User does not exist');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error during login');
    }
});


app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        } else {
            res.redirect("/")
        }
    });
});

app.post('/movies/:movieId/addcomment', isAuthenticated, async function (req, res) {
    try {
        const movieId = req.params.movieId;
        const commentText = req.body.comment;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        const comment = new Comment({
            movie: movieId,
            text: commentText,
        });

        const savedComment = await comment.save();

        movie.comments.push(savedComment._id);
        await movie.save();
        const referer = req.header('Referer')
        res.redirect(referer)
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/movies/:movieId/addrating', isAuthenticated, async function (req, res) {
    try {
        const movieId = req.params.movieId;
        const ratingValue = req.body.ratingValue;
        const userId = req.user._id; // Assuming the user is logged in and req.user is available

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        // Check if a rating from the current user already exists for this movie
        const existingRating = await Rating.findOne({ movie: movieId, user: userId });
        if (existingRating) {
            return res.status(400).send('You have already rated this movie.');
        }

        const rating = new Rating({
            movie: movieId,
            user: userId,
            ratingValue: ratingValue,
        });

        const savedRating = await rating.save();
        const referer = req.header('Referer')
        res.redirect(referer)
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/comments/:commentId/addrating', async function (req, res) {
    try {
        const commentId = req.params.commentId;
        const ratingValue = req.body.ratingValue;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        const commentRating = new CommentRating({
            comment: commentId,
            ratingValue: ratingValue,
        });

        const savedCommentRating = await commentRating.save();

        res.send(savedCommentRating);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 

process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    console.log('Closing Mongo Client.');
    closeDBConnection();
    server.close(() => {
      console.log('Http server closed.');
    });
  });
  