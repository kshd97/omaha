/**
 * Rmr_student_groupsController
 *
 * @description :: Server-side logic for managing rmr_student_groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createGroup: function(req, res) {
	    if(req.method=="POST")
	    {

			var grpname = req.param('groupname');
			var sz = 1;
			var grpid = req.session.me + 99;

			StudentData.findOne({userid: req.session.me}).exec(function(err5, result5) {
				if(err5)
				{
					return res.view('fail', {message: "Invalid student data. Contact WSDC"});
				}
				else
				{
			        var insert = "INSERT INTO rmr_student_groups (group_id, group_size, group_name) VALUES (" + grpid + "," + sz +",'" + grpname + "')";

			        Rmr_student_groups.query(insert,function(err,record)
			        {
			            if(err)
			            {
			               return res.view('fail', {message: "Invalid group"});
			            }
			            else
			            {

			                insert = "INSERT INTO rmr_student_groups_members (group_id, userid, is_group_admin) VALUES (" + grpid + "," + result5.registration_number + "," + sz + ")";
			                Rmr_student_groups_members.query(insert, function(err1, record1)
			                {
			                	if(err1)
			                	{
			                		return res.view('fail', {message: "Invalid group members"});
			                	}
                				return res.redirect('/mygroup');	
			                });
			            }
			        });
				}
			});	
	    }	
	},

	deleteGroup: function(req, res) {

		if(req.method == "POST")
		{
			// sails.log("here deleting");
			StudentData.findOne({userid: req.session.me}).exec(function(error1, result01) {
				if(error1) return res.view('fail', {message: "Invalid ID"});

				// sails.log("group by " + result01.registration_number);
				Rmr_student_groups_members.findOne({userid: result01.registration_number}).exec(function(error2, result02) {
					if(error2) return res.view('fail', {message: "Invalid group"});
					// sails.log("ID is " + result02.group_id);
					var q = "DELETE FROM rmr_student_groups_members WHERE group_id = " + result02.group_id;
					Rmr_student_groups_members.query(q, [], function(error3, result03) {
						if(error3) return res.view('fail', {message: "Invalid group members"});
						q = "DELETE FROM rmr_student_groups where group_id = " + result02.group_id;
						Rmr_student_groups.query(q, [], function(error4, result04) {
							if(error4) return res.view('fail', {message: "Invalid group"});
							q = "DEL4TE FROM rmr_student_requests where sender = " + result01.registration_number;
							Rmr_student_requests.query(q, [], function(error5, result05) {
								if(error5)
								{
									return res.view('fail', {message: "Could not delete. Contact admin"});
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
				if(error11) return res.view('fail', {message: "Invalid group"});
				var q = "UPDATE rmr_student_groups SET group_size = group_size - 1 WHERE group_id = " + result11.group_id;
				Rmr_student_groups.query(q, [], function(err12, result12) {
					if(error12) return res.view('fail', {message: "Invalid group"});
					var delQ = "DELETE FROM rmr_student_groups_members where userid = " + remmate;
					Rmr_student_requests.query(delQ, function(err13, result13) 
					{
						if(err13)
						{
							return res.view('fail', {message: "Could not remove. Contact admin"});
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
			var posroommates = req.session.posroommates;
            var flag = 0;
            for(var i = 0; i < posroommates.length; i++)
            {
            	// sails.log("possible is" + posroommates[i].registration_number);
                if(posroommates[i].registration_number == newmate)
                {
                    flag = 1;
                    break;
                }
			}

            if(flag == 1)
            {
            	StudentData.findOne({registration_number: newmate}).exec(function(eee, re){
            		if(eee) return res.view('fail', {message: "Invalid ID"});
	    			Type_of_admission.findOne({reg_no: newmate}).exec(function(error6, result06) {
	    				if(error6) return res.view('fail', {message: "Invalid type of admission"});
	    				if(re.gender == "F" || (re.gender == "M" && (re.current_year == 2 || re.current_year == 3) && result06.admissiontypeid == 1)){
			            	Rmr_student_groups_members.findOne({userid: newmate}).exec(function(err2, result3) {
								if(err2)
								{
									return res.view('fail', {message: "Invalid group members. Contact admin"});
								}            		

								if(result3 == undefined)
								{
									StudentData.findOne({userid: req.session.me}).exec(function(err6, result6) {
										if(err6) return res.view('fail', {message: "Invalid ID"});
										var q = "SELECT * FROM rmr_student_requests where sender = " + result6.registration_number + " AND receiver = " + newmate;
										
										Rmr_student_requests.query(q, [], function(error7, result07) 
										{
											if(error7) return res.view('fail', {message: "Invalid request"});
											if(result07.length == 0)
											{
												var insert = "INSERT INTO rmr_student_requests (sender, receiver) VALUES (" + result6.registration_number + "," + newmate + ")";
												Rmr_student_requests.query(insert, function(err3, record2) {
													if(err3)
													{
														return res.view('fail', {message: "Invalid request. Contact admin"});
													}
													return res.view('pass', {message: "Request sent"});
												});

											}
											else
											{
												return res.view('fail', {message: "Request already sent"});
											}
										});
									});
								}
								else
								{
									return res.view('fail', {message: "That person is already in a group"});
								}
			            	});
						}
		    		}); 
		    	});       	
            }
            else
            {
            	return res.view('fail', {message: "You cant send this person group request"});
            }    
		}

		//return res.redirect('/mygroup');
	},

	acceptInvite: function(req, res) {

		var acceptfrom = req.param("myMate");
		StudentData.findOne({registration_number: acceptfrom}).exec(function(err10, result112){
			Type_of_admission.findOne({reg_no: acceptfrom}).exec(function(err11,result11){

				Rmr_student_groups_members.findOne({userid: acceptfrom}).exec(function(err7, result7) {
					Rmr_student_groups.findOne({group_id: result7.group_id}).exec(function(err1, result1){
						if((result112.current_year == 3 && result11.admissiontypeid == 1 && result1.group_size < 2 && result112.gender == 'M') || (result112.current_year == 2 && result11.admissiontypeid == 1 && result112.gender == 'M' && result1.group_size < 3) || (result112.gender == 'F' && result1.group_size<5)){
							var q = "UPDATE rmr_student_groups SET group_size = group_size + 1 WHERE group_id = " + result7.group_id;
							Rmr_student_groups.query(q, [], function(err8, result8) {
								StudentData.findOne({userid: req.session.me}).exec(function(err9, result9) {
									var insert = "INSERT INTO rmr_student_groups_members (group_id, userid, is_group_admin) VALUES (" + result7.group_id + "," + result9.registration_number + "," + 0 + ")";
									Rmr_student_groups_members.query(insert, function(err3, record2) {
										if(err3)
										{
											return res.view('fail', {message: "Invalid group members. Contact admin"});
										}

										var delQ = "DELETE FROM rmr_student_requests where receiver = " + result9.registration_number + " and sender = " + acceptfrom;
										Rmr_student_requests.query(delQ, function(err10, result10) {

											if(err10)
											{
												return res.view('fail', {message: "Invalid request. Contact admin"});
											}
											else
											{
												return res.redirect('/receivedrequests');										
											}
										});
									});
								});					
							});
						}
						else{
							return res.view('fail', {message: "Group is full"});
						}		
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
						return res.view('fail', {message: "Invalid received requests. Contact admin"});
				  	}
				  	if(result){
				  		Rmr_student_groups.findOne({group_id: result.group_id}).exec(function(err, result1){
				  			if(result1){
				  				var query = "SELECT * from Rmr_student_groups_members where group_id = " + result1.group_id
				  				Rmr_student_groups_members.query(query, [], function(err, result2){
				  					// sails.log(result2);
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
				  					return res.view('fail', {message: "Invalid received requests. Contact admin"});
				  			
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
			return res.view('fail', {message: "Login please"});
		}
	},

	addToDb:function(req, res) {

		if(req.method == "POST")
		{
			var regnumb = req.param('regnumb');
			var categor = req.param('categor');

			var inserting = "INSERT INTO type_of_admission (reg_no, admissiontypeid) VALUES ('" + regnumb + "'," + categor + ")";
			Type_of_admission.query(inserting, [], function(errr, record200) {

				if(errr)
				{
					res.view('fail', {message: "Already exists"});
				}
				else
					return res.view('fail', {message: "Successfully added. Login again to continue"});
			});
		}	
		else
		{
			return res.view('addToDb');
		}	
	}
};