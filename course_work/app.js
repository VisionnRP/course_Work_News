const express = require('express');

const mustache = require('mustache-express');

const path = require('path');

const child_process = require('child_process');

const bodyParser = require('body-parser');

const busboyBodyParser = require('busboy-body-parser');

const mongoose = require('mongoose');

const sstatistics = require("simple-statistics")

const app = express();

const config = require('./config');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const Author = require("./models/author")

const viewsDir = path.join(__dirname, 'views');

app.engine("mst", mustache(path.join(viewsDir, "partials")));

app.set('views', viewsDir);

app.set('view engine', 'mst');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(busboyBodyParser({ limit: '5mb' }));

app.use(express.static('public'));

app.get('/backup', function(req, res) {
    const command = `mongodump --db mydb --collection author_stats`;
    child_process.exec(command);
    res.redirect('/');
});

app.get('/restore', function(req, res) {
    Author.removeAll().then(() => {
        const command = `mongorestore ./dump `;
        child_process.exec(command);
        res.redirect('/');
    })
});

app.get('/', function(req, res) {
    Author.getAll()
        .then(news => {
            news.sort(function(a, b) {
                return ('' + a.author).localeCompare(b.author);
            });

            let idx = 1;
            res.render('index', { news, "index": function() { return idx++; } });
        })
        .catch(err => res.status(500).send(err.toString()));
});

app.get('/newstemplate', function(req, res) {
    Author.getAll()
        .then(news => {
            news.sort(function(a, b) {
                return ('' + a.author).localeCompare(b.author);
            });

            let idx = 1;
            res.render('newstemplate', { news, "index": function() { return idx++; } });
        })
        .catch(err => res.status(500).send(err.toString()));
});

app.get('/graph', function(req, res) {
    Author.getAll()
        .then(stations => {
            let stationsArray = [];
            stations.map(value => stationsArray.push(value));
            stationsArray = [].concat.apply([], stationsArray);

            let airStatsArray = { byte: [], viewed: [], len: [] };
            for (let i = 0; i < stationsArray.length; i++) {
                let station = stationsArray[i];
                airStatsArray.byte.push(parseFloat(station.byte));
                airStatsArray.viewed.push(parseFloat(station.viewed));
                airStatsArray.len.push(parseFloat(station.len));
            }

            let mode = {
                byte: sstatistics.mode(airStatsArray.byte),
                viewed: sstatistics.mode(airStatsArray.viewed),
                len: sstatistics.mode(airStatsArray.len),
            };
            let median = {
                byte: sstatistics.median(airStatsArray.byte),
                viewed: sstatistics.median(airStatsArray.viewed),
                len: sstatistics.median(airStatsArray.len),
            };
            let idx = 1;
            res.render('graph', { mode, median, "index": function() { return idx++; } });
        });
});

app.get('/author', function(req, res) {
    Author.getAll()
        .then(auth => {
            res.send(auth);
        });
});

app.use(cookieParser());
app.use(session({
    secret: config.SecretString,
    resave: false,
    saveUninitialized: true
}));

const PORT = config.ServerPort;
const databaseUrl = config.DatabaseUrl;
const connectOptions = { useNewUrlParser: true };

mongoose.connect(databaseUrl, connectOptions)
    .then(() => console.log(`Database connected: ${databaseUrl}`))
    .then(() => app.listen(PORT, function() { console.log('Server is ready'); }))
    .catch(err => console.log(`Start error ${err}`));

const getNews = require('./service')

setInterval(getNews.getNews, 30000);