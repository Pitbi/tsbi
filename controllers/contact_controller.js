var ENVIRONMENT 	= process.env.NODE_ENV || "dev";
var config 				= require('../config/config' + '.' + ENVIRONMENT);
var email    = require("emailjs/email");

var ContactController = function(req, res, next) {
  this.res = res;
  this.req = req;
  return this;
};

ContactController.prototype.GET = function () {
  var self= this;

  self.res.render("contact/show");
};

ContactController.prototype.POST = function () {
  var self= this;
  var attributes = self.req.body;
  console.log(attributes);
  sendOfferByMail(attributes, function (err) {
  	if (err) throw err;

  	
  	self.res.redirect("back");
  });
};


module.exports = ContactController;


var sendOfferByMail = function(attributes, callback) {
  var server  = email.server.connect({
    user: config.smtp.user,
    password: config.smtp.password,
    host: config.smtp.host,
    ssl: true
  });
  server.send({
    text:    attributes.message,
    from:    config.smtp.sender,
    to:      "pierre.biezemans@gmail.com",
    subject: "TSBI.be: " + attributes.subject
  }, callback);
};