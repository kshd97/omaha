	/**
 * BookingController
 *
 * @description :: Server-side logic for managing bookings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	book: function (req, res) {
		
		var uid = req.session.me;
		var await1 = require('await');
		var unique = require('array-unique').immutable;
		sails.log(uid);
		StudentData.findOne({userid:uid}).exec(function (err, result){
		  if (err) {
		    return res.serverError(err);
		  }
		  sails.log(result.current_year);
		  sails.log(result.course);
		  Course.findOne({course: result.course}).exec(function(err1, result1){
		  	if(err1){
		  		
		  		return res.serverError(err1);
		  	}
		  	sails.log(result1);
		  	var year = parseInt(result.current_year);
		  	Courseyear.findOne({course: result1.id, year: year}).exec(function(err2, result2){
			  	if(err2){
			  		return res.serverError(err2);
			  	}
			  	sails.log(result2);
			  	Gender.findOne({gender: result.gender}).exec(function(err3, result3){
			  		if(err3){
			  			return res.serverError(err3);
			  		}
			  		Admissiontype.findOne({admissiontype: 'JEE'}).exec(function(err4, result4){
			  			if(err4){
			  				return res.serverError(err4);
			  			}
			  			Studenttypeid.findOne({gender: result3.id, courseyear: result2.id, admissiontype: result4.id}).exec(function(err5, result5){
			  				if(err5){
					  			return res.serverError(err5);
					  		}
			  				sails.log(result5.id);
			  				sails.log("TMKC");
			  				Hosteltypeid.find({studenttypeid: result5.id}).exec(function(err6, result6){
			  					if(err6){
			  						return res.serverError(err6);
			  					}
			  					sails.log(result6);
			  					var hostelfloors = [];
			  					for (var i = 0; i < result6.length; i++) {
			  						hostelfloors[i] = result6[i].hostelfloors;
			  					}
			  					sails.log(hostelfloors);
			  					//var result7 = Hostelfloors.find({ id: hostelfloors[0] });
			  					//sails.log(result7.hostel);
			  					var inclause = "(";
			  					for (var i = 0; i < hostelfloors.length - 1; i++) {
			  						inclause = inclause + hostelfloors[i] + ","; 
			  					}
			  					inclause = inclause + hostelfloors[hostelfloors.length-1] + ")";
			  					var query = "SELECT * from hostelfloors where id in" + inclause;
			  					Hostelfloors.query(query, [], function(err7, result7){
			  						if(err7){
			  							return res.serverError(err7);
			  						}
			  						sails.log(result7);
			  						var hostelids = [];
			  						for (var i = 0; i < result7.length; i++) {
			  							hostelids[i] = result7[i].hostel;
			  						}
			  						sails.log(unique(hostelids));
			  						

			  						inclause = "(";
			  						for (var i = 0; i < hostelids.length - 1; i++) {
			  							inclause = inclause + hostelids[i] + ","; 
			  						}
			  						inclause = inclause + hostelids[hostelids.length-1] + ")";
			  						query = "SELECT * from hostel where id in" + inclause;
			  						Hostel.query(query, [], function(err8, result8){
			  							if(err8){
			  								return res.serverError(err8)
			  							}
			  							sails.log(result8);
			  							var hostelnames = [];
			  							for (var i = 0; i < result8.length; i++) {
			  								hostelnames[i] = result8[i].name;
			  							}
			  							sails.log(hostelnames);
			  							// return res.view('displayhostels', {
    								// 		hostelnames: hostelnames,
    								// 		hostelfloors: result7
			  							// });			  							
			  						});
			  					});
			  				});
			  			});
			  		});
			  	});
		  	});
		});
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
},
	
};

