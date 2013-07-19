var TechniquesController = function(req, res, next) {
  this.res = res;
  this.req = req;
  return this;
};

TechniquesController.prototype.GET = function () {
  var self= this;

  self.res.render("techniques/show");
};

module.exports = TechniquesController;