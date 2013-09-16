var ENVIRONMENT 	= process.env.NODE_ENV || "dev";
	
var express       = require("express");
var mongoose      = require("mongoose");
var config 				= require('./config/config' + '.' + ENVIRONMENT);
var viewHelpers 	= require("./helpers/view_helpers");
var server 				= express();

//CONTROLLER

var HomeController = require("./controllers/home_controller");
var TechniquesController = require("./controllers/techniques_controller");
var ContactController = require("./controllers/contact_controller");
var ReferencesController = require("./controllers/references_controller")

server.configure(function () {
  server.use(express.favicon(__dirname + '/public/favicon.ico'));
  server.use(express.logger({format: "dev", stream: process.stdout}));
  server.use(express.static(__dirname + "/public"));
  server.use(express.bodyParser());
  server.use(express.methodOverride());
	server.use(express.cookieParser());
  //server.use(express.session({store: config.sessions.store, secret: config.sessions.secret}));;
  //server.use(passport.initialize());
  //server.use(passport.session());

  server.use(server.router);
  server.set("view engine", "jade");
  //server.set("views", __dirname + "/app/views");
  server.set("view options", {
    layout: "layouts/application"
  });
});


//HTTP REQUEST

var routes = {
  "/": HomeController,
  "/techniques": TechniquesController,
  "/contact": ContactController,
  "/references": ReferencesController,
  "/references/:id": ReferencesController,
};

server.use(function (req, res, next) {
  res.locals.helpers = viewHelpers;
  var Controller = findMatchingController(req, res, next);
  if (Controller) {
    var controller = new Controller(req, res, next);
    controller[req.method]();
  } else {
    next();
  }
});

function findMatchingController(req, res, next) {
  var path = req.path;
  for (var i in routes) {
    if (i == path) {
      return routes[i]; 
    } else if (i.match("/:id")) {
      var collection = i.replace("/:id", "")
      var indexOfCollection = path.indexOf(collection);
      if (indexOfCollection == 0) {
        return routes[i];
      }
    }
  }
};

server.listen(process.env.PORT || 6555);
