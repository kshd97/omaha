module.exports = function(req, res, next) {
   req.roomnames = [];
   next();
}