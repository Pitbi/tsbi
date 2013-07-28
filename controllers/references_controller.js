var ReferencesController = function(req, res, next) {
  this.res = res;
  this.req = req;
  return this;
};

ReferencesController.prototype.GET = function () {
  var self= this;
  var reference = /references\/(.*)$/.exec(self.req.url);
  console.log("ref",reference);
  if (!reference || reference[1] === "staquet") {
  	self.res.render("references/index");
  } else {
  	console.log(":p");
  	self.res.render("references/" + reference[1] + "/show")
  }
};

module.exports = ReferencesController;