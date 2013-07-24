var ContactController = function(req, res, next) {
  this.res = res;
  this.req = req;
  return this;
};

ContactController.prototype.GET = function () {
  var self= this;

  self.res.render("contact/show");
};

module.exports = ContactController;