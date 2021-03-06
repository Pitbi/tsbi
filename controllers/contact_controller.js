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

  self.res.render("contact/show", {contactError: null, contactInfo: null});
};

ContactController.prototype.POST = function () {
  var self= this;
  var attributes = self.req.body;
  var contactError = "Une erreure s'est produite lors de l'envoie de votre mail. Vérifiez que vous vous avez bien entrer votre nom nom, adresse email ainsi qu'un message."
  sendOfferByMail(attributes, function (err) {
  	if (err) {
      self.res.render("contact/show", {contactError: contactError, contactInfo: null});
    }

  	self.res.render("contact/show", {contactError: null, contactInfo: true});
  });
};


module.exports = ContactController;


var sendOfferByMail = function(attributes, callback) {
  console.log(attributes);
  var message = attributes.message + "\r\n\r\n\r\n Répondre à l'adresse suivante: " + attributes.email
  var server  = email.server.connect({
    user: config.smtp.user,
    password: config.smtp.password,
    host: config.smtp.host,
    ssl: true
  });
  server.send({
    text:    message,
    from:    config.smtp.sender,
    to:      config.smtp.sender,
    subject: "TSBI.be: " + attributes.subject
  }, callback);
};