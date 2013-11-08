var fs = require("fs");

var ReferencesController = function(req, res, next) {
  this.res = res;
  this.req = req;
  return this;
};

ReferencesController.prototype.GET = function () {
  var self= this;
  var reference = /references\/(.*)$/.exec(self.req.url);
  console.log("ref",reference);
  if (!reference) {
  	self.res.redirect("/references/blanmont")
  } else {
    var files = fs.readdirSync("public/images/" + reference[1] + "/");
  	self.res.render("references/" + reference[1] + "/show", {images: files, folder: reference[1]})
  }
};

module.exports = ReferencesController;