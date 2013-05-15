var ENVIRONMENT 	= process.env.NODE_ENV || "dev";
	
var express       = require("express");
var mongoose      = require("mongoose");



var config 				= require('./config/config' + '.' + ENVIRONMENT);
var viewHelpers 	= require("./helpers/view_helpers");

var server 				= express.createServer();

server.configure(function () {
  server.use(express.logger({format: "dev", stream: process.stdout}));
  server.use(express.static(__dirname + "/public")); // sert les "assets" (fichiers statiques genre html, css, jpg...)
  server.use(express.bodyParser());
  server.use(express.methodOverride());
	server.use(express.cookieParser());
  //server.use(express.session({store: config.sessions.store, secret: config.sessions.secret}));;
  //server.use(passport.initialize());
  //server.use(passport.session());
  server.use(function (req, res, next) { req.member = req.user; next(); });
  server.use(server.router);
  server.set("view engine", "ejs");
  //server.set("views", __dirname + "/app/views");
  server.set("view options", {
    layout: "layouts/application"
  });
  server.dynamicHelpers(viewHelpers);
});


server.listen(process.env.PORT || 5555);
