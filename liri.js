require("dotenv").config();

const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const axios = require("axios");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);
const logPath = "log.txt";
var action = process.argv[2];
var thing = process.argv[3];
const defaultMovie = "Troll 2";
const defaultSong = "Tacky";
const defaultBand = "Orgy";

for (var i = 4; i < process.argv.length; i++) {
    thing += '+' + process.argv[i];
};

function figureItOut(action, thing) {

	// console.log(thing);

	switch(action) {

    case 'concert-this':
		if(thing === undefined) {
			thing = defaultBand;
		}     
        findThem(thing);
        break;
	case 'spotify-this-song':
		if(thing === undefined) {
			thing = defaultSong;
		}     
        spotifyThis(thing);
        break;
	case 'movie-this':
		if(thing === undefined) {
			thing = defaultMovie;
		}    
        movieThis(thing);
        break;
	case 'do-what-it-says':
        doWhatItSays();
        break;
	default: 
        console.log("Invalid command. Please type any of the following commnds: concert-this, spotify-this-song, movie-this or do-what-it-says");
        logFile("Invalid command. Please type any of the following commnds: concert-this, spotify-this-song, movie-this or do-what-it-says");
    }
};

function logFile(input) {
    let whatToLog = "\r\n" + input;
    fs.appendFileSync(logPath, whatToLog, function(err) {
        if (err) {
            console.log(err);
        }
    });
};

function findThem(thing) {
    let queryUrl = "https://rest.bandsintown.com/artists/" + thing + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            for (j = 0; j < response.data.length; j++) {
                date = moment(response.data[i].datetime).format("L")
                let concertData = "\nVenue: " + response.data[j].venue.name + "\nLocation: " + response.data[j].venue.city + ", " + response.data[j].venue.region + " " + response.data[j].venue.country + "\nDate: " + date;
                console.log(concertData)
                logFile(concertData);
            }
        }
    )
    .catch(function(err) {
        console.log(err);
        logFile(err);
    });
};

function spotifyThis(thing) {
	spotify.search({ type: 'track', query: thing }).then(
        function (response) {
            let songInfo = response.tracks.items;
            let songData = "\nArtist(s): " + songInfo[0].artists[0].name + "\nSong Name: " + songInfo[0].name + "\nPreview Link: " + songInfo[0].preview_url + "\nAlbum: " + songInfo[0].album.name;
            console.log(songData);
            logFile(songData);
        }
    )
    .catch(function(err) {
        console.log(err);
        logFile(err);
    });
};

function movieThis(thing) {
    let queryUrl = "http://www.omdbapi.com/?t=" + thing + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            let movie = response.data;
            let movieData = "\nTitle: " + movie.Title + "\nRelease Year: " + movie.Year + "\nIMDB rating: " + movie.imdbRating + "\nRotten Tomatoes Rating: " + movie.Ratings[1].Value + "\nCountry: " + movie.Country + "\nLanguage: " + movie.Language + "\nPlot: " + movie.Plot + "\nActors: " + movie.Actors;
            console.log(movieData);
            logFile(movieData);
        }
    )
    .catch(function(err) {
        console.log(err);
        logFile(err);
    })
};

function doWhatItSays() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		let dataArr = data.split(',');
		figureItOut(dataArr[0], dataArr[1]);
	});
};


figureItOut(action, thing);