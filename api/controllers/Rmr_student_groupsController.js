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

			StudentData.findOne({userid: req.session.me}).exec(function(err5, result5) {
				if(err5)
				{
					return res.serverError(err5);
				}
				else
				{
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
			                sails.log("2. " + result5.registration_number);
			                sails.log("3. " + sz);



			                insert = "INSERT INTO rmr_student_groups_members (group_id, userid, is_group_admin) VALUES (" + grpid + "," + result5.registration_number + "," + sz + ")";
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
			});
	    }

		return res.redirect('/mygroup');		
	},

	deleteGroup: function(req, res) {

		if(req.method == "POST")
		{
			sails.log("here deleting");
			StudentData.findOne({userid: req.session.me}).exec(function(error1, result01) {

				sails.log("group by " + result01.registration_number);
				Rmr_student_groups_members.findOne({userid: result01.registration_number}).exec(function(error2, result02) {

					sails.log("ID is " + result02.group_id);
					var q = "DELETE FROM rmr_student_groups_members WHERE group_id = " + result02.group_id;
					Rmr_student_groups_members.query(q, [], function(error3, result03) {

						q = "DELETE FROM rmr_student_groups where group_id = " + result02.group_id;
						Rmr_student_groups.query(q, [], function(error4, result04) {

							q = "DELETE FROM rmr_student_requests where sender = " + result01.registration_number;
							Rmr_student_requests.query(q, [], function(error5, result05) {

								if(error5)
								{
									return res.serverError(error5);
								}
								else
								{
									return res.redirect('/mygroup');
								}
							});
						});
					});

				});
			});
		}

	},

	removeMate: function(req, res) {

		if(req.method == "POST")
		{
			var remmate = req.param("toremove");

			Rmr_student_groups_members.findOne({userid: remmate}).exec(function(err11, result11) {

				var q = "UPDATE rmr_student_groups SET group_size = group_size - 1 WHERE group_id = " + result11.group_id;
				Rmr_student_groups.query(q, [], function(err12, result12) {

					var delQ = "DELETE FROM rmr_student_groups_members where userid = " + remmate;
					Rmr_student_requests.query(delQ, function(err13, result13) 
					{
						if(err13)
						{
							return res.serverError(err13);
						}
						else
						{
							return res.redirect('/mygroup');										
						}
					});
				});
			});
		}
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
    			Type_of_admission.findOne({reg_no: newmate}).exec(function(error6, result06) {

    				if(result06.admissiontypeid == 1)
    				{
		            	Rmr_student_groups_members.findOne({userid: newmate}).exec(function(err2, result3) {
							if(err2)
							{
								return res.serverError(err2);
							}            		

							if(result3 == undefined)
							{
								StudentData.findOne({userid: req.session.me}).exec(function(err6, result6) {
									var insert = "INSERT INTO rmr_student_requests (sender, receiver) VALUES (" + result6.registration_number + "," + newmate + ")";
									Rmr_student_requests.query(insert, function(err3, record2) {
										if(err3)
										{
											return res.serverError(err3);
										}
									});
								});
							}
		            	});
					}
	    		});        	
            }    
		}

		return res.redirect('/mygroup');
	},

	acceptInvite: function(req, res) {

		var acceptfrom = req.param("myMate");
	
		Rmr_student_groups_members.findOne({userid: acceptfrom}).exec(function(err7, result7) {

			var q = "UPDATE rmr_student_groups SET group_size = group_size + 1 WHERE group_id = " + result7.group_id;
			Rmr_student_groups.query(q, [], function(err8, result8) {


				StudentData.findOne({userid: req.session.me}).exec(function(err9, result9) {
					var insert = "INSERT INTO rmr_student_groups_members (group_id, userid, is_group_admin) VALUES (" + result7.group_id + "," + result9.registration_number + "," + 0 + ")";
					Rmr_student_groups_members.query(insert, function(err3, record2) {
						if(err3)
						{
							return res.serverError(err3);
						}

						var delQ = "DELETE FROM rmr_student_requests where receiver = " + result9.registration_number + " and sender = " + acceptfrom;
						Rmr_student_requests.query(delQ, function(err10, result10) {

							if(err10)
							{
								return res.serverError(err10);
							}
							else
							{
								return res.redirect('/receivedrequests');										
							}
						});
					});
				});					
			});			
		});

		// return res.redirect('/receivedrequests');
	},

	receivedrequests: function(req, res) {
		var uid = req.session.me;		
		if (req.session.me) 
		{

			StudentData.findOne({userid: uid}).exec(function(err0, result0) {
				Rmr_student_groups_members.findOne({userid: result0.registration_number}).exec(function(err, result){
					if (err) {
				    	return res.serverError(err);
				  	}
				  	if(result){
				  		Rmr_student_groups.findOne({group_id: result.group_id}).exec(function(err, result1){
				  			if(result1){
				  				var query = "SELECT * from Rmr_student_groups_members where group_id = " + result1.group_id
				  				Rmr_student_groups_members.query(query, [], function(err, result2){
				  					sails.log(result2);
				  					if(!result2){
				  						group_members = null
				  					}

				  					return res.redirect('/mygroup')
				  				});
				  			}
				  		});
				  	}
				  	else{
				  		var admTypeQuery = "SELECT * from rmr_student_requests where receiver = " + result0.registration_number;
				  		var resulttype;
				  		
				  		Rmr_student_requests.query(admTypeQuery, [], function(err4, result4) {

				  			if(err4)
				  					return res.serverError(err4);
				  			
				  			if(result4.length != 0)
				  			{
				  				return res.view('receivedrequests', {mems: result4, flag: 0});
				  			}
				  			else
				  			{
				  				return res.view('receivedrequests', {mems: result4, flag: 1});
				  			}
				  		});
				  	}
				});
			});


		}
		else
		{
			sails.log("Login please");
		}
	}
};

