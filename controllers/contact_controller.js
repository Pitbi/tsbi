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

  self.res.render("contact/show", {contactError: null});
};

ContactController.prototype.POST = function () {
  var self= this;
  var attributes = self.req.body;
  var contactError = "Une erreure s'est produite lors de l'envoie de votre mail. Vérifiez que vous vous avez bien entrer votre nom nom, adresse email ainsi qu'un message."
  sendOfferByMail(attributes, function (err) {
    console.log("err", err);
  	if (err) {
      self.res.render("contact/show", {contactError: contactError});
    }

  	self.req.flash('info', "Merci pour votre mail, nous vous recontacterons le plus vite possible.");
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