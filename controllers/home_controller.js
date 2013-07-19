var HomeController = function(req, res, next) {
  this.res = res;
  this.req = req;
  return this;
};

HomeController.prototype.GET = function () {
  var self= this;

  self.res.render("home/show");
};

module.exports = HomeController;