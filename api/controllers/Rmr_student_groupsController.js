/**
 * Rmr_student_groupsController
 *
 * @description :: Server-side logic for managing rmr_student_groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// mygroup: function (req, res) {
	// 	if (req.session.me) {
	// 		var uid = req.session.me;
	// 		Rmr_student_groups_members.findOne({userid: uid}).exec(function(err, result){
	// 			if (err) {
	// 		    	return res.serverError(err);
	// 		  	}
	// 		  	if(result){
	// 		  		Rmr_student_groups.findOne({group_id: result.group_id}).exec(function(err, result1){
	// 		  			if(result1){
	// 		  				var query = "SELECT * from Rmr_student_groups_members where group_id = " + result1.group_id
	// 		  				Rmr_student_groups_members,query(query, [], function(err, result2){
	// 		  					sails.log(result2);
	// 		  					if(!result2){
	// 		  						group_members = null
	// 		  					}
	// 		  					return res.view('mygroup', {
	// 		  						group_members : result2,		  					
	// 		  					});
	// 		  				});
	// 		  			}
	// 		  		});
	// 		  	}
	// 		  	else{

	// 		  	}
	// 		});
	// 	}
	// 	else{
	// 		sails.log("Login please");
	// 	}
	// },


	createGroup: function(req, res) {

		// sails.log(req.session.me);
	    if(req.method=="POST")
	    {

			var grpname = req.param('groupname');
			var sz = 1;
			var grpid = req.session.me + 99;

	        var insert = "INSERT INTO rmr_student_groups (group_id, group_size, group_name) VALUES (" + grpid + "," + sz +",'" + grpname + "')";

	        Rmr_student_groups.query(insert,function(err,record)
	        {
	            if(err)
	            {
	                sails.log(err);
	            }
	            else
	            {
	                // res.redirect('/mygroup');
	                sails.log("1. " + grpid);
	                sails.log("2. " + req.session.me);
	                sails.log("3. " + sz);

	                insert = "INSERT INTO rmr_student_groups_members (group_id, userid, is_group_admin) VALUES (" + grpid + "," + req.session.me + "," + sz + ")";
	                Rmr_student_groups_members.query(insert, function(err1, record1)
	                {
	                	if(err1)
	                	{
	                		sails.log(err1)
	                	}
	                });
	            }
	        });
	    }

		return res.redirect('/mygroup');		
	},


	inviteMate: function(req, res) {
		if(req.method == "POST")
		{
			var newmate = req.param("newmateregno");

            var fs = require("fs");
            var data = fs.readFileSync("student_data.csv");
            var studs = data.toString().split("\"");

            var flag = 0;
            for(var i = 0; i < studs.length; i++)
                if(studs[i] == newmate)
                {
                    flag = 1;
                    break;
                }

            if(flag == 1)
            {
            	Rmr_student_groups_members.findOne({userid: newmate}).exec(function(err2, result3) {
					if(err2)
					{
						return res.serverError(err2);
					}            		

					if(result3 == undefined)
					{
						var insert = "INSERT INTO rmr_student_requests (sender, receiver) VALUES (" + req.session.me + "," + newmate + ")";
						Rmr_student_requests.query(insert, function(err3, record2) {
							if(err3)
							{
								return res.serverError(err3);
							}
						});
					}
            	});
            }    
		}

		return res.redirect('/mygroup');
	},

	receivedrequests: function(req, res) {
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

			return res.view('receivedrequests');
		}
		else
		{
			sails.log("Login please");
		}
	}
};

