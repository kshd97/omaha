/**
 * BookingController
 *
 * @description :: Server-side logic for managing bookings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	book: function (req, res) {
		
		var uid = req.session.me;
		sails.log(uid);
		StudentData.findOne({userid:uid}).exec(function (err, result){
  if (err) {
    return res.serverError(err);
  }
  sails.log(result.gender);
});
// });
// 		StudentData.find(userid : 25).exec(function(err, result){
// 			sails.log(result.gender);
// 		});
	// 		if(err) {
	// 			return res.serverError(err);
	// 		}
	// 		sails.log(result.gender);
	// 		// sails.log(result.current_year);
	// 		// sails.log(result.course);
	// 	});
	 	return res.redirect('/dashboard');
	// }),
}
	
};

