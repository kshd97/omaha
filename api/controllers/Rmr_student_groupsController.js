/**
 * Rmr_student_groupsController
 *
 * @description :: Server-side logic for managing rmr_student_groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	mygroup: function (req, res) {
		if (req.session.me) {
			var uid = req.session.me;
			Rmr_student_groups_members.findOne({userid: uid}).exec(function(err, result){
				if (err) {
			    	return res.serverError(err);
			  	}
			  	if(result){
			  		Rmr_student_groups.findOne({group_id: result.group_id}).exec(function(err, result1){
			  			if(result1){
			  				var query = "SELECT * from Rmr_student_groups_members where group_id = " + result1.group_id
			  				Rmr_student_groups_members,query(query, [], function(err, result2){
			  					sails.log(result2);
			  					if(!result2){
			  						group_members = null
			  					}
			  					return res.view('mygroup', {
			  						group_members : result2,		  					
			  					});
			  				});
			  			}
			  		});
			  	}
			  	else{

			  	}
			});
		}
		else{
			sails.log("Login please");
		}
	}
};

