require("dotenv").config();

// Our requirements
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const axios = require("axios");
const fs = require("fs");
// Spotify keys
const spotify = new Spotify(keys.spotify);
// Log file
const logPath = "log.txt";
// Grab our command line inputs
var action = process.argv[2];
var thing = process.argv[3];
// Default items when the user doesn't input a movie, song or band
const defaultMovie = "Troll 2";
const defaultSong = "Tacky";
const defaultBand = "Orgy";

// If our command line arguments go past [3], this will combine multiple words with a + in between to pass to our functions
for (var i = 4; i < process.argv.length; i++) {
    thing += '+' + process.argv[i];
};

// Main function to run subfunction based on user input
function figureItOut(action, thing) {

	// console.log(thing);

	switch(action) {
    // Does our action input === concert-this?
    case 'concert-this':
		if(thing === undefined) {
			thing = defaultBand;
		}     
        findThem(thing);
        break;
    // Does our action input === spotify-this-song?
	case 'spotify-this-song':
		if(thing === undefined) {
			thing = defaultSong;
		}     
        spotifyThis(thing);
        break;
    // Does our action input === movie-this?
	case 'movie-this':
		if(thing === undefined) {
			thing = defaultMovie;
		}    
        movieThis(thing);
        break;
    // Does our action input === do-what-it-says?
	case 'do-what-it-says':
        doWhatItSays();
        break;
    // If the action input doesn't match those choices, inform the user of their folly
	default: 
        console.log("Invalid command. Please type any of the following commnds: concert-this, spotify-this-song, movie-this or do-what-it-says");
        logFile("Invalid command. Please type any of the following commnds: concert-this, spotify-this-song, movie-this or do-what-it-says");
    }
};

// Function to log our responses from our api calls
function logFile(input) {
    let whatToLog = "\r\n" + input;
    fs.appendFileSync(logPath, whatToLog, function(err) {
        if (err) {
            console.log(err);
        }
    });
};

// Find the bands function
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

// Function to spotify the input song
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

// Function to look up our movie input
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

// Function to do the laziness
function doWhatItSays() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		let dataArr = data.split(',');
		figureItOut(dataArr[0], dataArr[1]);
	});
};

// Calling our main function to run
figureItOut(action, thing);