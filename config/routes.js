

module.exports.routes = {


  '/': { view: 'login' },
  '/dashboard': { view: 'dashboard' },
  '/notallowed': { view: 'notallowed' },
  '/fail': { view: 'fail' },
  '/mess': {view:'choosemess'},

  '/bookroom': 'BookingController.book',
  '/book/:roomno': 'BookingController.bookroom',
  '/messbook/:messid': 'BookingController.bookmess',
  'post /messbookgroup': 'BookingController.messbookgroup',
  '/fillallotmenttable': 'BookingController.fillallotmenttable',
  // '/messbook/:messname': 'BookingController.bookmess',

  '/genstdtypeids' : 'StudenttypeidController.index',
  'post /login': 'UsersController.login',
  '/logout': 'UsersController.logout',


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
