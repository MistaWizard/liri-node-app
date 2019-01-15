require("dotenv").config();

const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const axios = require("axios");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);
var action = process.argv[2];
var thing = process.argv[3];
const defaultMovie = "Troll 2";
const defaultSong = "Tacky";

for (var i = 4; i < process.argv.length; i++) {
    thing += '+' + process.argv[i];
};

function figureItOut(action, thing){

	console.log(thing);

	switch(action){

    case 'concert-this':
		if(thing === undefined){
			thing = defaultSong;
		}     
		findThem(thing); break;
	case 'spotify-this-song':
		if(thing === undefined){
			thing = defaultSong;
		}     
		spotifyThis(thing); break;
	case 'movie-this':
		if(thing === undefined){
			thing = defaultMovie;
		}    
		movieThis(thing); break;
	case 'do-what-it-says':
		doWhatItSays(); break;
	default: 
		console.log("Invalid command. Please type any of the following commnds: concert-this, spotify-this-song, movie-this or do-what-it-says");
    }
};

function findThem(thing) {
    queryUrl = "https://rest.bandsintown.com/artists/" + thing + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            for(j = 0; j < response.data.length; j++){
                date = moment(response.data[i].datetime).format("L")
                let concertData = "\nVenue: " + response.data[j].venue.name + " \nLocation: " + response.data[j].venue.city + ", " + response.data[j].venue.region + " " + response.data[j].venue.country + " \nDate: " + date;
                console.log(concertData)  
            }
        }
    )
    .catch(function(err) {
        console.log(err);
    });
};

function spotifyThis(thing) {
	spotify.search({ type: 'track', query: thing }).then(
        function (response) {
            let songInfo = response.tracks.items;
            console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
            console.log("Album: " + songInfo[0].album.name);
        }
    )
    .catch(function(err) {
        console.log(err);
    });
};

function movieThis(thing) {
    axios.get("http://www.omdbapi.com/?t=" + thing + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            let movie = response.data;
            let movieData = "\nTitle: " + movie.Title + " \nRelease Year: " + movie.Year + " \nIMDB rating: " + movie.imdbRating + " \nRotten Tomatoes Rating: " + movie.Ratings[1].Value + " \nCountry: " + movie.Country + " \nLanguage: " + movie.Language + " \nPlot: " + movie.Plot + " \nActors: " + movie.Actors;
            console.log(movieData);
        }
    )
    .catch(function(err) {
        console.log(err);
    })
};

function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		let dataArr = data.split(',');
		figureItOut(dataArr[0], dataArr[1]);
	});
};


figureItOut(action, thing);