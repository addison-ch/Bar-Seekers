const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const parks = require('./routes/parks');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/barparks', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndexes: true, useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("db connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'aterriblesecret', resave: false, saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();

})

app.use("/parks", parks);
app.use("/parks/:id/reviews/", reviews);


app.all("*", (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Oh no! Something went wrong :("
    }
    res.status(statusCode).render('errors.ejs', { err })
})


app.listen(3000, function () {
    console.log('Serving on port 3000');
})