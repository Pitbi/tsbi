var fs = require("fs");
var im = require("imagemagick");
var async = require("async");

var bigSizeFolder = "../public/images/cortil-big/"
var destinationFolder = '../public/images/cortil/';
var files = fs.readdirSync(bigSizeFolder);

console.log(files);
	async.eachSeries(files, function(file, callback) {
		var filePath = bigSizeFolder + file;
		if (file.toLowerCase().match("jpg")) {
			im.resize({
			  srcPath: filePath,
			  dstPath: destinationFolder + file,
			  height:   540
			}, function(err, stdout, stderr){
			  if (err) console.log(err, stdout, stderr);
			  console.log('resized', file, stdout, stderr);
			  callback();
			});
		} else {
			callback();
		}
			
	}, function (err){
		if (err) throw err;

		console.log("FINISH");
	});