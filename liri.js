require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var action = process.argv[2];
var thing = process.argv[3];
var defaultMovie = "Troll 2";
var defaultSong = "Tacky";

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

figureItOut(action, thing);