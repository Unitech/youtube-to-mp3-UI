/*
 * You own you tube to mp3
 * by Strzelewicz Alexandre
 */

var util = require('util');
var fs = require('fs');
var express = require('express');
var exec = require('child_process').exec;
var child;
var querystring = require('querystring');
var app = express.createServer();

var fs = require('fs');

app.get('/', function(req, res){
    fs.readdir('./tmp', function(err, list) {
	res.render('index.ejs', { 
	    layout : false,
	    tmp : list
	});
    });
});


app.get('/test', function(req, res) {
    res.send({'lol':'lol'});
});

var sess = 0;

app.get('/send_link', function(req, res) {
    
    var cmd_title = 'youtube-dl -e ' + req.query.link;
    var cmd_filename = 'youtube-dl -t --get-filename ' + req.query.link;
    var cmd_video = "cd tmp && youtube-dl -t " + req.query.link;
    
    console.log('Begining new download of url = ' + cmd_title);
    exec(cmd_title, function(er, so, serr) {
	if (er !== null) {
	    res.send({'success':false, 'info' : serr});
	    return false;
	}

	var title = so
	    .replace(/ /g,"_")
	    .replace('\n', '')
	    .replace('(', '')
	    .replace(')', '')
	    .replace(',', '')
	    .replace(':', '')
	    .replace('&', '')
	    .replace('"', '')
	    .replace('"', '')
	    .replace('%', '')
	    .replace('\\', '');
	title += '.mp3';

	// 1# Grab the title of the video
	console.log('Begining new download of url = ' + title);
	exec(cmd_filename, function(er, so, serr) {
	    if (er !== null) {
		res.send({'success':false, 'info' : serr});
		return false;
	    }
	    var filename = so.replace('\n', '');

	    console.log('Rm ' + title);
	    
	    // 2# Remove old file
	    exec("rm ./tmp/" + title, function(er, so, serr) {		
		console.log('File successfully removed');
		console.log('Begininnig download');

		// 3# Download the video in FLV
		exec(cmd_video, function(er, so, serr) {
		    if (er !== null) {
			console.log('Error while downloading');
			res.send({'success':false, 'info' : serr});
			return false;
		    }
		    
		    console.log('Download OK');		    
		    var cmd_convert = "cd tmp && ffmpeg -i " + filename + " \"" + title + "\"";
		    console.log('Converting with : ' + cmd_convert);

		    // 4# Convert the video to mp3
		    exec(cmd_convert, function(er, so, serr) {
			if (er !== null) {
			    res.send({'success':false, 'info' : serr});
			    return false;
			}
			console.log('CONVERTED');
			console.log('Delete raw file : ' + "cd tmp && rm " + filename);

			// 5# Delete the old file
			exec("cd tmp && ll " + filename, function(er, so, serr) {
			    console.log('Raw file deleted');
			    res.send({'success':'true', 'file' : title});
			    return true;
			});			
		    });		
		});
	    });
	});
    });
});

app.get('/*.js', function(req, res) {
    res.attachment('./public/js/' + req.query.file);
    res.sendfile('./public/js/' + req.query.file);
});

app.get('/download', function(req, res) {
    var file = querystring.unescape(req.query.filename);
    console.log('download' + util.inspect(file));
    res.attachment('./tmp/' + file);
    res.sendfile('./tmp/' + file);
});

app.listen(3001);
console.log('Listening on 3001');

