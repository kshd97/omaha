	/**
 * BookingController
 *
 * @description :: Server-side logic for managing bookings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	book: function (req, res) {
		if(req.session.me){
			var uid = req.session.me;
			var unique = require('array-unique').immutable;
			var HashMap = require('hashmap');
			sails.log("HETTE"+uid);
			StudentData.findOne({userid:uid}).exec(function (err, result){
			  if (err || result == undefined) {
			    return res.view('fail', {message: "Invalid ID"});
			  }
			  // sails.log(result.current_year);
			  // sails.log(result.course);
			  Course.findOne({course: result.course}).exec(function(err1, result1){
			  	if(err1 || result1 == undefined){
			  		return res.view('fail', {message: "Invalid course"});
			  	}
			  	// sails.log(result1);
			  	var year = parseInt(result.current_year);
			  	Courseyear.findOne({course: result1.id, year: year}).exec(function(err2, result2){
				  	if(err2 || result2 == undefined){
				  		return res.view('fail', {message: "Invalid course year"});
				  	}
				  	// sails.log(result2);
				  	Gender.findOne({gender: result.gender}).exec(function(err3, result3){
				  		if(err3 || result3 == undefined){
				  			return res.view('fail', {message: "Invalid gender"});
				  		}

				  		Type_of_admission.findOne({reg_no: result.registration_number}).exec(function(errr, resulttype) {
							if(errr || resulttype == undefined){
				  				return res.view('fail', {message: "Invalid type of admission"});
				  			}				  			

				  			if(resulttype.admissiontypeid == 1)
				  				resulttype = "JEE";
				  			else
				  				resulttype = "DASA";

				  		Admissiontype.findOne({admissiontype: resulttype}).exec(function(err4, result4){
				  			if(err4 || result4 == undefined){ 
				  				return res.view('fail', {message: "Invalid admissiontype"});
				  			}
				  			Studenttypeid.findOne({gender: result3.id, courseyear: result2.id, admissiontype: result4.id}).exec(function(err5, result5){
				  				if(err5 || result5 == undefined){
						  			return res.view('fail', {message: "Invalid studenttypeid"});
						  		}
						  		req.session.studenttypeid = result5.id;
				  				Hosteltypeid.find({studenttypeid: result5.id}).exec(function(err6, result6){
				  					if(err6 || result6 == undefined){
				  						return res.view('fail', {message: "Invalid hostel type"});
				  					}
				  					// sails.log('result6 is ' + result6);
				  					var hostelfloors = [];
				  					for (var i = 0; i < result6.length; i++) {
				  						hostelfloors[i] = result6[i].hostelfloors;
				  					}
				  					// sails.log(hostelfloors);
				  					req.session.hostelfloors = hostelfloors;
				  					//var result7 = Hostelfloors.find({ id: hostelfloors[0] });
				  					// sails.log(result7.hostel);
				  					var inclause = "(";
				  					for (var i = 0; i < hostelfloors.length - 1; i++) {
				  						inclause = inclause + hostelfloors[i] + ","; 
				  					}
				  					inclause = inclause + hostelfloors[hostelfloors.length-1] + ")";
				  					var query = "SELECT * from hostelfloors where id in" + inclause;
				  					Hostelfloors.query(query, [], function(err7, result7){
				  						if(err7 || result7 == undefined){
				  							return res.view('fail', {message: "Invalid hostel floors"});
				  						}
				  						var hostelids = []; 
				  						for (var i = 0; i < result7.length; i++) {
				  							hostelids[i] = result7[i].hostel;
				  						}
				  						// sails.log(unique(hostelids));
				  						

				  						inclause = "(";
				  						for (var i = 0; i < hostelids.length - 1; i++) {
				  							inclause = inclause + hostelids[i] + ","; 
				  						}
				  						inclause = inclause + hostelids[hostelids.length-1] + ")";
				  						query = "SELECT * from hostel where id in" + inclause;
				  						Hostel.query(query, [], function(err8, result8){
				  							if(err8 || result8 == undefined){
				  								return res.view('fail', {message: "Invalid type of admissiontype"});
				  							}
				  							// sails.log(result8);
				  							var hostelnames = [];
				  							for (var i = 0; i < result8.length; i++) {
				  								hostelnames[i] = result8[i].name;
				  							}
				  							// sails.log(hostelnames);
				  							inclause = "(";
				  							var a = unique(hostelids);
					  						for (var i = 0; i < a.length - 1; i++) {
					  							inclause = inclause + a[i] + ","; 
					  						}
					  						inclause = inclause + a[a.length-1] + ")";
				  							query = "SELECT * from hostelfloors where hostel in "+ inclause;
				  							Hostelfloors.query(query, [], function(err9, result9){
				  								if(err9 || result9 == undefined){
				  									return res.view('fail', {message: "Invalid hostel floors"});
				  								}
				  								var b = [];
				  								for (var i = 0; i < result9.length; i++) {
				  									b[i] = result9[i].id;
				  								}
				  								inclause = "(";
				  								for (var i = 0; i < b.length-1; i++) {
				  									inclause = inclause + b[i] + ",";
				  								} 
				  								inclause = inclause + b[b.length-1] + ")";
				  								query = "SELECT hostelfloors from hosteltypeid where hostelfloors in "+ inclause + "and studenttypeid = "+ result5.id;
				  								Hosteltypeid.query(query, [], function(err10, result10){
				  									if(err || result10 == undefined){
				  										return res.view('fail', {message: "Invalid hostel type"});
				  									}
				  									var finalhostelfloors = [];
				  									for (var i = 0; i < result10.length; i++) {
				  										finalhostelfloors[i] = result10[i].hostelfloors;
				  									}
				  									// sails.log(finalhostelfloors);
				  									inclause = "(";
				  									for (var i = 0; i < finalhostelfloors.length-1; i++) {
				  										inclause = inclause + finalhostelfloors[i] + ",";
				  									}
				  									inclause = inclause + finalhostelfloors[finalhostelfloors.length-1] + ")";
				  									query = "SELECT hostel.name, hostelfloors.block, hostelfloors.floor from hostelfloors, hostel where hostelfloors.id in "+ inclause +"and hostel.id = hostelfloors.hostel";
				  									Hostelfloors.query(query, [], function(err11, result11){
				  										sails.log(result11);

				  										// var arr2d = [][];
				  										if(err || result11 == undefined){
				  											return res.view('fail', {message: "Invalid hostel floors"});
				  										}
				  										var map = new HashMap();
				  										for (var i = 0; i < result11.length; i++) {
				  											if(!map.get(result11[i].name)){
				  												var arr = [];
				  												arr.push(result11[i]);
				  												// sails.log("HEYYY");
				  												// sails.log(arr);
				  												map.set(result11[i].name,arr);
				  												// sails.log(map);
				  											}
				  											else{
				  												var arr = [];
				  												arr = map.get(result11[i].name);
				  												// sails.log(arr);
				  												// sails.log("pushed");
				  												arr.push(result11[i]);
				  												// sails.log("BC");
				  												// sails.log(arr);
				  												map.delete(result11[i].name);
				  												map.set(result11[i].name, arr);
				  												// sails.log(map);
				  											}
				  										}
				  										map.forEach(function(value, key) {
														    console.log(key + " : " + JSON.stringify(value));
														});
														Rmr_student_groups_members.findOne({userid: result.registration_number}).exec(function(err12, group){
															if(err12){
																return res.view('fail', {message: "Invalid group members"});
															}
															if(!group){
																return res.view('displayhostels', {
						    										hostels: map,
						    										req: req,
						    										group_size: 1,
									  							});
															}
															Rmr_student_groups.findOne({group_id: group.group_id}).exec(function(err13, group1){
																if(err12){
																	return res.view('fail', {message: "Invalid group members"});
																}
																return res.view('displayhostels', {
						    										hostels: map,
						    										req: req,
						    										group_size: group1.group_size,
									  							});
															});
														});
				  										
				  									});
				  								});
				  							});			  							
				  						});
				  					});
				  				});
				  			});
				  		});

				  		});

				  	});
			  	});
			});
		});
	}
	else
	{
		return res.redirect('/');
	}
},

deleteshit: function(req, res){
	var criteria = {};
	Global.roomlist = [];
//	Global.idlist = [];
	var valuestoset = {room: null, mess: null};
	Allotment.update(criteria, valuestoset).exec(function(err, result){
		valuestoset = {allotted: 0};
		Rooms.update(criteria, valuestoset).exec(function(err, result){
			valuestoset = {allotted : 0};
			Mess.update(criteria, valuestoset).exec(function(err, result){

				return res.redirect('/');
			});
		});
	});
},

bookroom: function(req,res){

	if(req.session.me)
	{
		var userid = req.session.me;
		var roomno = req.param('roomno');
		var criteria = {};
		var valuestoset = {};
		StudentData.findOne({userid:userid}).exec(function (err, re){
	        if (err || re==undefined) {
	            return res.view('fail', {message: "Your ID was not found"});
	        }
		// sails.log(Global.roomlist);	
		// var str = "hsgf"
			if(Global.roomlist.indexOf(roomno) != -1){
				// sails.log("HHOHOHOHOHO");  						// send back to booking page
				return res.redirect('/bookroom');
			}
			Allotment.findOne({studentdata:re.registration_number}).exec(function(err,alreadybookcheck){
				if (err || alreadybookcheck == undefined) {
		            return res.view('fail', {message: "Not in Allotment"});
		        }
				if(alreadybookcheck.room != null){
					//user already booked a room and tries to access through url
					Rooms.findOne({id:alreadybookcheck.room}).exec(function(err,room){
						if (err || room == undefined) {
				            return res.view('fail', {message: "Not a valid room."});
				        }
	                    Mess.findOne({id:alreadybookcheck.mess}).exec(function(err,mess){
	                    	if (err || mess == undefined) {
					            return res.view('fail', {message: "Not a valid mess."});
					        }
	                        StudentData.findOne({userid:userid}).exec(function(err,details){
	                        	if (err || details == undefined) {
						            return res.view('fail', {message: "Your ID was not found"});
						        }
	                            Hostelfloors.findOne({id:room.hostelfloors}).exec(function(err,hostelfloor){
	                            	if (err || hostelfloor == undefined) {
							            return res.view('fail', {message: "Invalid hostel floor"});
							        }
	                                Hostel.findOne({id:hostelfloor.hostel}).exec(function(err,hostel){
	                                	if (err || hostel == undefined) {
								            return res.view('fail', {message: "Invalid hostel"});
								        }
	                                    return res.view('booked',{room:room.roomno,hostel_name:hostel.name,block:hostelfloor.block,floor:hostelfloor.floor, mess:mess.name ,reg_no:details.registration_number,name: details.name});
	                                })
	                            });
	                        });
	                    });
	                });
				}
				else{
					Rooms.findOne({roomno: roomno}).exec(function(err, result){
						if (err || result == undefined) {
				            return res.view('fail', {message: "Invalid Room"});
				        }
						if(result.allotted == 1){
							// sails.log("Room is ALREADY BOOKED,book another");
							return res.redirect("/bookroom");
						}
						if(result.noofbedsleft - 1 == 0){
							Global.roomlist.push(roomno);
						}
						valuestoset = {room: result.id};
						Rmr_student_groups_members.findOne({userid: re.registration_number}).exec(function(err,groupid){
							if(err || groupid == undefined){
								return res.view('fail', {message: "Invalid Group members"});
							}
							if(groupid){
								var rms =[];
								Rmr_student_groups_members.find({group_id: groupid.group_id}).exec(function(err, roommates){
									if(err || roommates == undefined){
										return res.view('fail', {message: "Invalid roommate ids"});
									}
									for (var i = 0; i < roommates.length; i++) {
										rms[i] = roommates[i].userid;
									}
									inclause = "(";
									for (var i = 0; i < rms.length - 1; i++) {
										inclause = inclause +"'"+ rms[i] + "',"; 
									}
							  		inclause = inclause +"'"+ rms[rms.length-1] + "')";
									var query = "SELECT name,registration_number from studentdata where registration_number in "+inclause;
									StudentData.query(query,[], function(err, names){
										//for sending names and ids to mess page
										if(err || names == undefined){
											return res.view('fail', {message: "Roommate names dont exist"});
										}
										for (var i = 0; i < roommates.length; i++) { 
											criteria = {studentdata: roommates[i].userid};
											Allotment.update(criteria, valuestoset).exec(function(err, result1){
												if(err || result1 == undefined){
													return res.view('fail', {message: "Allotment couldn't update"});
												}
											});
										}	
										
										result.noofbedsleft -= roommates.length;
										if(result.noofbedsleft == 0){
											result.allotted = 1;
										}

										result.save(function(err){
											if(err){
												return res.view('fail', {message: "Couldn't save room."});
											}
											sails.sockets.broadcast('rooms', 'new_entry', roomno);
										});
										Global.roomlist.splice(Global.roomlist.indexOf(roomno), 1);
										Messtypeid.find({studenttypeid: req.session.studenttypeid}).exec(function(err3, result3){
										  	if(err3 || result3 == undefined){
												return res.view('fail', {message: "Invalid mess type id."});
											}
											var messesid=[];
											for (var i = 0; i < result3.length; i++) {
										  		messesid[i] = result3[i].mess;
											}
										  	// sails.log(messesid);
										 	inclause = "(";
										  	for (var i = 0; i < messesid.length - 1; i++) {
									  			inclause = inclause + messesid[i] + ","; 
									  		}
									  		inclause = inclause + messesid[messesid.length-1] + ")";
									  		query = "SELECT * from mess where allotted < capacity and id in" + inclause;
									  		Mess.query(query, [], function(err4, result4){
									  			if(err4 || result4 == undefined){
									  				return res.view('fail', {message: "Couldn't update mess."});
									  			} 					
												return res.view('choosemessgroup',{messes : result4, names: names});
											});	
										});	
									}); 
								});
									
							}
							else{
								// sails.log("hfhgfghghghghghhgjhuhuhuhuftddufufdytfuftydtftfdtftdtyffgfghdf");
								// sails.log("1234");
								criteria =  {studentdata: re.registration_number};
								Allotment.update(criteria, valuestoset).exec(function(err, result1){
									if(err || result1 == undefined){
										return res.view('fail', {message: "Allotment couldn't update"});
									}
									result.noofbedsleft--;
									if(result.noofbedsleft == 0){
										result.allotted = 1;
									}
									result.save(function(err){
										if(err){
											return res.view('fail', {message: "Couldn't save"});
										}
										// sails.log("2345");
										sails.sockets.broadcast('rooms', 'new_entry', roomno);
									});
									Global.roomlist.splice(Global.roomlist.indexOf(roomno), 1);
									Messtypeid.find({studenttypeid: req.session.studenttypeid}).exec(function(err3, result3){
									  	if(err3 || result3 == undefined){
											return res.view('fail', {message: "Invalid mess type id"});
										}
										var messesid=[];
										for (var i = 0; i < result3.length; i++) {
									  		messesid[i] = result3[i].mess;
										}
									 	inclause = "(";
									  	for (var i = 0; i < messesid.length - 1; i++) {
								  			inclause = inclause + messesid[i] + ","; 
								  		}
								  		inclause = inclause + messesid[messesid.length-1] + ")";
								  		query = "SELECT * from mess where allotted < capacity and id in" + inclause;
								  		Mess.query(query, [], function(err4, result4){
								  			if(err4 || result4 == undefined){
								  				return res.view('fail', {message: "Invalid mess"});
								  			}
								  			// sails.log(result4);		  					
											return res.view('choosemess',{messes : result4});
										});	
									});	
								});
							}
						});
					});
				}
			});
		});
	}
	else{
		return res.redirect('/');
	}
},

startallot:function(req,res){
	query = "SELECT id from studenttypeid";
	id = parseInt(req.param('id'));
	Studenttypeid.query(query,[],function(err,result){
		if(req.param('id')){
			Global.idlist.push(id);
			return res.view('startallot',{all : result , started :Global.idlist});
		}
		else{
			return res.view('startallot',{all : result , started :Global.idlist});
		}
	});
	
},

stopallot:function(req,res){
	query = "SELECT id from studenttypeid";
	id = req.param('id');
	Studenttypeid.query(query,[],function(err,result){
		Global.idlist.splice(Global.idlist.indexOf(id), 1);
		return res.view('startallot',{all : result , started :Global.idlist});
	});
},

bookmess:function(req,res){
	if(req.session.me)
	{
		var messid = req.param('messid');
		var userid = req.session.me;
		var reg_no =req.session.registration_number;
		sails.log(reg_no);
		var criteria = {studentdata: reg_no};
		var valuestoset = {mess: messid};
		console.log(messid);
		Allotment.update(criteria, valuestoset).exec(function(err1, result1){
			if(err1 || result1 == undefined) {
				return res.view('fail', {message: "Allotment couldn't update"});
			}
			// sails.log(result1[0].room);
			Mess.findOne({id:messid}).exec(function(err2, result2) {
				if(err2 || result2 == undefined){
					return res.view('fail', {message: "Invalid mess"});
				}
				// sails.log(result2);
				result2.allotted++;
	  			result2.save(function(err2){
	  				if(err2){
						return res.view('fail', {message: "Couldn't save"});
					} 

	  				Rooms.findOne({id:result1[0].room}).exec(function(err,room){
	  					if(err || room == undefined){
							return res.view('fail', {message: "Room not found."});
						}
                        StudentData.findOne({userid:userid}).exec(function(err,details){
                        	if(err || details == undefined){
								return res.view('fail', {message: "Invalid ID"});
							}
                            Hostelfloors.findOne({id:room.hostelfloors}).exec(function(err,hostelfloor){
                            	if(err || hostelfloor == undefined){
									return res.view('fail', {message: "Invalid hostel floors"});
								}
                                Hostel.findOne({id:hostelfloor.hostel}).exec(function(err,hostel){
                                	if(err || hostel == undefined){
										return res.view('fail', {message: "Invalid hostel"});
									}
                                    return res.view('booked',{room:room.roomno,hostel_name:hostel.name,block:hostelfloor.block,floor:hostelfloor.floor, mess:result2.name ,reg_no:details.registration_number,name: details.name});
                                })
                            });
                        });
                	});
	  			});
			});
		});	
	}
	else
		return res.redirect('/');				
},

messbookgroup:function(req,res){
	if(req.session.me)
	{
		var data = req.params.all();
		// sails.log("rrrr"); 
		sails.log(data);
		var str = '';
		str = str + req.session.registration_number;
		sails.log(req.session.registration_number);
		var index = data.userid.indexOf(str);
		sails.log(index);
		var mess1 = data.student[index];
		sails.log(mess1);

		for (var i = 0; i < data.student.length; i++) {
			// var flag =0;
			// sails.log("boom");
			var messid = data.student[i];
			var registration_number = data.userid[i];
			var criteria = {studentdata: registration_number};
			var valuestoset = {mess: messid};
			sails.log(messid);
			Allotment.update(criteria,valuestoset).exec(function(err1, result1){
				if(err1) {
					return res.serverError(err1);
				}
			});
			Mess.findOne({id:messid}).exec(function(err2, result2) {
				if(err2){
					return res.serverError(err);
				}
				result2.allotted++;
	  			result2.save(function(err2) { /* updated user */ 
	  				
	  			});
			});
		}
		// for(var i = 0;i < data.student.length; i++){
		// 	var messid = data.student[i];
			
		// }
		Allotment.findOne({studentdata:req.session.registration_number}).exec(function(err,allot){
			Rooms.findOne({id:allot.room}).exec(function(err,room){
	            Mess.findOne({id:mess1}).exec(function(err,mess){
	                StudentData.findOne({userid:req.session.me}).exec(function(err,details){
	                    Hostelfloors.findOne({id:room.hostelfloors}).exec(function(err,hostelfloor){
	                        Hostel.findOne({id:hostelfloor.hostel}).exec(function(err,hostel){
	                            return res.view('booked',{room:room.roomno,hostel_name:hostel.name,block:hostelfloor.block,floor:hostelfloor.floor, mess:mess.name ,reg_no:details.registration_number,name: details.name});
	                        });
	                    });
	                });
	            });
	        });
		});
			
	}
	else
		return res.redirect('/');
},


fillallotmenttable: function(req,res){
	StudentData.find().exec(function(err, result){
		sails.log(result);
		for (var i = 0; i < result.length; i++) {
			sails.log(result[i].id);
			Allotment.create({studentdata: result[i].registration_number, room: null, mess: null}).exec(function(err, sample) {

			    if (err) {
			    	return res.serverError(err);
			    }
			   	// sails.log(sample);
			    

			});
		}
		return res.redirect('/');
		
	});	
	
},

onlymess: function(req,res){
	if(req.session.me){	
	StudentData.findOne({userid:req.session.me}).exec(function (err, result){
		  if (err) {
		    return res.serverError(err);
		  }
		  Course.findOne({course: result.course}).exec(function(err1, result1){
		  	if(err1){
		  		
		  		return res.serverError(err1);
		  	}
		  	var year = parseInt(result.current_year);
		  	Courseyear.findOne({course: result1.id, year: year}).exec(function(err2, result2){
			  	if(err2){
			  		return res.serverError(err2);
			  	}
			  	Gender.findOne({gender: result.gender}).exec(function(err3, result3){
			  		if(err3){
			  			return res.serverError(err3);
			  		}


			  		Type_of_admission.findOne({reg_no: result.registration_number}).exec(function(errr, resulttype) {

				  		if(resulttype.admissiontypeid == 1)
				  			resulttype = 'JEE';
				  		else
				  			resulttype = 'DASA';

			  			// sails.log(resulttype + ' is the type');

				  		Admissiontype.findOne({admissiontype: resulttype}).exec(function(err4, result4){
				  			if(err4){
				  				return res.serverError(err4);
				  			}
				  			
				  			Studenttypeid.findOne({gender: result3.id, courseyear: result2.id, admissiontype: result4.id}).exec(function(err5, result5){
				  				if(err5){
						  			return res.serverError(err5);
						  		}
				  				// sails.log(result5.id);
								Rmr_student_groups_members.findOne({userid: req.session.registration_number}).exec(function(err,admin){
									// sails.log(admin);
									if(admin){
								        if(admin.is_group_admin == 1){
								      		var rms =[];
											Rmr_student_groups_members.find({group_id: admin.group_id}).exec(function(err, roommates){
												if(err){
													return res.serverError(err);
												}
												for (var i = 0; i < roommates.length; i++) {
													rms[i] = roommates[i].userid;
												}
												inclause = "(";
												for (var i = 0; i < rms.length - 1; i++) {
													inclause = inclause + "'"+rms[i] + "',"; 
												}
										  		inclause = inclause +"'"+ rms[rms.length-1] + "')";
												var query = "SELECT name,registration_number from studentdata where registration_number in "+inclause;
												StudentData.query(query,[], function(err, names){
													//for sending names and ids to mess page
													Messtypeid.find({studenttypeid: result5.id}).exec(function(err, result6){
													  	if(err){
															return res.serverError(err);
														}
														// sails.log(result6);	
														var messesid=[];
														for (var i = 0; i < result6.length; i++) {
													  		messesid[i] = result6[i].mess;
														}
													  	// sails.log(messesid);
													 	inclause = "(";
													  	for (var i = 0; i < messesid.length - 1; i++) {
												  			inclause = inclause + messesid[i] + ","; 
												  		}
												  		inclause = inclause + messesid[messesid.length-1] + ")";
												  		query = "SELECT * from mess where allotted < capacity and id in" + inclause;
												  		Mess.query(query, [], function(err, result7){
												  			if(err){
												  				return res.serverError(err)
												  			}
												  			// sails.log(result7);	
												  			// sails.log(names);	  					
															return res.view('choosemessgroup',{messes : result7, names: names});
														});	
													});	
												}); 
											});				            
								        }
								        else if(admin.is_group_admin !=1){
								        	return res.view('notallowed');
								        }
								    }
									else{
							            Messtypeid.find({studenttypeid: result5.id}).exec(function(err, result6){
										  	if(err){
												return res.serverError(err);
											}
											// sails.log(result6);	
											var messesid=[];
											for (var i = 0; i < result6.length; i++) {
										  		messesid[i] = result6[i].mess;
											}
										  	// sails.log(messesid);
										 	inclause = "(";
										  	for (var i = 0; i < messesid.length - 1; i++) {
									  			inclause = inclause + messesid[i] + ","; 
									  		}
									  		inclause = inclause + messesid[messesid.length-1] + ")";
									  		query = "SELECT * from mess where allotted < capacity and id in" + inclause;
									  		Mess.query(query, [], function(err, result7){
									  			if(err){
									  				return res.serverError(err)
									  			}
									  			// sails.log(result7);		  					
												return res.view('choosemess',{messes : result7});
											});	
										});	
							        }
							    });    
							});
						});
			  		});
				});
			});
		});
	});	
}
else{
	return res.redirect('/');
}
},

mygroup: function(req,res){
	if(req.session.me){
		// sails.log(req.cookie.hey);
		// sails.log("jhhj");
		StudentData.findOne({userid:req.session.me}).exec(function (err, result){
		  if (err || result ==undefined) {
		  		return res.view('fail', {message: "Invalid student data. Contact WSDC"});
		  }
		  Course.findOne({course: result.course}).exec(function(err1, result1){
		  	if(err1 || result1 ==undefined){
				return res.view('fail', {message: "Invalid course. Contact WSDC"});
		  	}
		  	var year = parseInt(result.current_year);
		  	Courseyear.findOne({course: result1.id, year: year}).exec(function(err2, result2){
			  	if(err2 || result2  ==undefined){
			  		return res.view('fail', {message: "Invalid year. Contact WSDC"});
			  	}
			  	Gender.findOne({gender: result.gender}).exec(function(err3, result3){
			  		if(err3 || result3 ==undefined){
			  			return res.view('fail', {message: "Invalid gender. Contact WSDC"});
			  		}

					// sails.log(result.registration_number);

				  	Type_of_admission.findOne({reg_no: result.registration_number}).exec(function(errr, resulttype) {
				  		if(errr || resulttype== undefined){
		  					return res.view('fail', {message: "Reg no not in type_of_admission. Contact WSDC"});
			  			}
			  			var resulttype1=resulttype.admissiontypeid;
				  		if(resulttype.admissiontypeid == 1)
				  			resulttype = 'JEE';
				  		else
				  			resulttype = 'DASA';

				  		Admissiontype.findOne({admissiontype: resulttype}).exec(function(err4, result4){
				  			if(err4 || result4 ==undefined ){
				  				return res.view('fail', {message: "Invalid admission type. Contact WSDC"});
				  			}
				  			
				  			Studenttypeid.findOne({gender: result3.id, courseyear: result2.id, admissiontype: result4.id}).exec(function(err5, result5){
				  				if(err5 || result5 ==undefined ){
						  			return res.view('fail', {message: "Invalid student type. Contact WSDC"});
						  		}

				  				StudentData.find({gender: result.gender, course: result.course ,current_year: result.current_year }).exec(function(err20, studentlist){
				  					if(err20 || studentlist ==undefined ){
				  						return res.view('fail', {message: "Invalid student roommates. Contact Admin"});
				  					}
				  					inclause="(";
				  					for (var i=0;i<studentlist.length-1;i++){
				  						// if(studentlist[i].registration_number == '811457')

				  						inclause=inclause+"'"+studentlist[i].registration_number+"',";
				  					}
				  					inclause = inclause + "'"+studentlist[studentlist.length-1].registration_number + "')";
				  					var query1 = "SELECT reg_no from type_of_admission WHERE admissiontypeid=" + resulttype1 + " AND reg_no IN "+ inclause;

				  					Type_of_admission.query(query1,[],function(err21,regnos) {
				  						if(err21 || regnos ==undefined){
				  							return res.view('fail', {message: "Possible roommates reg no not present in Type_of_admission. Contact WSDC"});
				  						}
				  						inclause="(";
				  						for (var i=0;i<regnos.length-1;i++){

				  							inclause=inclause+"'"+regnos[i].reg_no+"',";
				  						}
				  						inclause = inclause +"'"+ regnos[regnos.length-1].reg_no + "')";
				  						var query2 = "SELECT name, registration_number from studentdata where registration_number in "+inclause+" and registration_number!='"+result.registration_number+"'";

				  							StudentData.query(query2, [], function(err, posroommates) {
				  								// sails.log(posroommates);
				  								if(err || posroommates ==undefined){
				  									return res.view('fail', {message: "Invalid posroommates in studentdata. Contact WSDC"});
				  								}
												req.session.posroommates=posroommates; 
												Rmr_student_groups_members.findOne({userid: result.registration_number}).exec(function(err,admin){ 
													if(err){
														return res.view('fail', {message: "Invalid reg no in Rmr_student_groups_members. Contact WSDC"});
													}
													var rms =[];

													if(admin == undefined)
													{
														var names = "NO group.";

														return res.view('my_group',{names: names,myreg_no:result.registration_number, flag: 1, group_size: 0, gender: result3.gender, current_year: result.current_year});	
													}
													else
													{
														Rmr_student_groups_members.find({group_id: admin.group_id}).exec(function(err, roommates){
															if(err){
																return res.view('fail', {message: "Invalid group id in Rmr_student_groups_members. Contact WSDC"});
															}if(roommates ==undefined){
return res.view('fail',{message:"Your group has been deleted.Please login again"});
}
															Rmr_student_groups.findOne({group_id: admin.group_id}).exec(function(err90, result90){
																if(err90 || result90 ==undefined){
																	return res.view('fail', {message: "Invalid group id in Rmr_student_groups. Contact WSDC"});
																}
																inclause="(";
																for (var i = 0; i < roommates.length - 1; i++) {
																	inclause = inclause +"'"+ roommates[i].userid + "',"; 
																}
														  		inclause = inclause +"'"+ roommates[roommates.length-1].userid + "')";

																var query = "SELECT name, registration_number from studentdata where registration_number in "+inclause;
																StudentData.query(query,[], function(err, names){
																	if(err ||names==undefined){
																		return res.view('fail', {message: "Invalid group member names from studentdata. Contact WSDC"});
																	}
																	//for sending names and ids to mess page
																	if(admin.is_group_admin==1){

																		return res.view('my_group',{names: names,myreg_no:result.registration_number, flag: 0, group_size: result90.group_size, gender: result3.gender, current_year: result.current_year});
																	}
																	else{
																		return res.view('groupfornonadmins',{names: names});
																	}	
																}); 
															});
														});
													}
												});
				  							});

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
	}
	else
		return res.redirect('/');
}

};
