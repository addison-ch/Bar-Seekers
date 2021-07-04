const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Park = require('./models/park');

mongoose.connect('mongodb://localhost:27017/barparks', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndexes: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("db connected");
});

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home.ejs');
})
app.get('/makepark', async (req, res) => {
    const park = new Park({ title: 'ACCI', description: 'good park' });
    await park.save();
    res.send(park)
})
app.listen(3000, function () {
    console.log('Serving on port 3000');
})