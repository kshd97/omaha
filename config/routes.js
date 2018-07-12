 

module.exports.routes = {


  '/': { view: 'login' },
  '/dashboard': { view: 'dashboard' },
  '/notallowed': { view: 'notallowed' },
  '/fail': { view: 'fail' },
  '/mess': { view:'choosemess'},
  //'/students': { view:'students'},

  '/gotoDash': 'UsersController.gotoDash',
  '/admin': 'BookingController.startallot',
  '/start/:id': 'BookingController.startallot',
  '/stop/:id': 'BookingController.stopallot',
  '/bookroom': 'BookingController.book',
  '/onlymess': 'BookingController.onlymess',
  '/mygroup': 'BookingController.mygroup',
  '/book/:roomno': 'BookingController.bookroom',
  '/messbook/:messid': 'BookingController.bookmess',
  'post /messbookgroup': 'BookingController.messbookgroup',
  '/fillallotmenttable': 'BookingController.fillallotmenttable',
  // '/mygroup': 'Rmr_student_groupsController.mygroup',
  '/receivedrequests': 'Rmr_student_groupsController.receivedrequests',
  '/createGroup': 'Rmr_student_groupsController.createGroup',
  '/inviteMate': 'Rmr_student_groupsController.inviteMate',
  '/acceptInvite': 'Rmr_student_groupsController.acceptInvite',
  '/removeMate': 'Rmr_student_groupsController.removeMate',
  '/deleteGroup': 'Rmr_student_groupsController.deleteGroup',
  '/addToDb': 'Rmr_student_groupsController.addToDb',
  '/deleteshit': 'BookingController.deleteshit', //**********************DO NOT USE DURING OMAHA************
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
