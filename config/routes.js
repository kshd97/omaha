

module.exports.routes = {


  '/': { view: 'login' },
  '/dashboard': { view: 'dashboard' },
  '/fail': { view: 'fail' },

  '/bookroom': 'BookingController.book',
  '/genstdtypeids' : 'StudenttypeidController.index',
  'post /login': 'UsersController.login',

  /**
 * AllotmentController
 *
 * @description :: Server-side logic for managing allotments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// module.exports = {
// 	index: function (req, res) {
// 		uid = req.session.me;
// 		StudentData.find(userid:uid).exec(function(err, result){
// 			if(err) {
// 				return res.serverError(err);
// 			}
// 			sails.log(result.gender);
// 			sails.log(result.current_year);
// 			sails.log(result.course);
// 		});
// 		return res.redirect('/dashboard');
// 	}
	
// };





};
