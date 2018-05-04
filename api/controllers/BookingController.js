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
				  				req.session.studenttypeid = result5.id;
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
				  					req.session.hostelfloors = hostelfloors;
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
				  							inclause = "(";
				  							var a = unique(hostelids);
					  						for (var i = 0; i < a.length - 1; i++) {
					  							inclause = inclause + a[i] + ","; 
					  						}
					  						inclause = inclause + a[a.length-1] + ")";
				  							query = "SELECT * from hostelfloors where hostel in "+ inclause;
				  							Hostelfloors.query(query, [], function(err9, result9){
				  								sails.log(result9);
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
				  									sails.log(result10);
				  									var finalhostelfloors = [];
				  									for (var i = 0; i < result10.length; i++) {
				  										finalhostelfloors[i] = result10[i].hostelfloors;
				  									}
				  									sails.log(finalhostelfloors);
				  									inclause = "(";
				  									for (var i = 0; i < finalhostelfloors.length-1; i++) {
				  										inclause = inclause + finalhostelfloors[i] + ",";
				  									}
				  									inclause = inclause + finalhostelfloors[finalhostelfloors.length-1] + ")";
				  									query = "SELECT hostel.name, hostelfloors.block, hostelfloors.floor from hostelfloors, hostel where hostelfloors.id in "+ inclause +"and hostel.id = hostelfloors.hostel";
				  									Hostelfloors.query(query, [], function(err11, result11){
				  										sails.log(result11);
				  										// var arr2d = [][];
				  										var map = new HashMap();
				  										for (var i = 0; i < result11.length; i++) {
				  											if(!map.get(result11[i].name)){
				  												var arr = [];
				  												arr.push(result11[i]);
				  												sails.log("HEYYY");
				  												sails.log(arr);
				  												map.set(result11[i].name,arr);
				  												sails.log(map);
				  											}
				  											else{
				  												var arr = [];
				  												arr = map.get(result11[i].name);
				  												sails.log(arr);
				  												sails.log("pushed");
				  												arr.push(result11[i]);
				  												sails.log("BC");
				  												sails.log(arr);
				  												map.delete(result11[i].name);
				  												map.set(result11[i].name, arr);
				  												sails.log(map);
				  											}
				  										}
				  										sails.log(map);
				  										sails.log("nmnmnm");
				  										map.forEach(function(value, key) {
														    console.log(key + " : " + JSON.stringify(value));
														});
														Rmr_student_groups_members.findOne({userid: uid}).exec(function(err12, group){
															if(!group){
																sails.log("zzzzzz");

																return res.view('displayhostels', {
						    										hostels: map,
						    										req: req,
						    										group_size: 1,
									  							});
															}
															sails.log("llllllll");
															Rmr_student_groups.findOne({group_id: group.group_id}).exec(function(err13, group1){
																sails.log("qqqq");
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
	}
	else
	{
		return res.redirect('/');
	}
},

deleteshit: function(req, res){
	var criteria = {};
	Global.roomlist = [];
	var valuestoset = {room: null, mess: null};
	Allotment.update(criteria, valuestoset).exec(function(err, result){
		valuestoset = {allotted: 0, noofbedsleft: 3, capacity: 3};
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
		console.log(req.roomnames);
		console.log(req.param('roomno'));
		var userid = req.session.me;
		var roomno = req.param('roomno');
		var criteria = {};
		var valuestoset = {};
		//sails.log(Global.roomlist);	
		// var str = "hsgf"
		if(Global.roomlist.indexOf(roomno) != -1){
			sails.log("HHOHOHOHOHO");  						// send back to booking page
			return res.redirect('/bookroom');
		}
		Global.roomlist.push(roomno);
		Allotment.findOne({studentdata:userid}).exec(function(err,alreadybookcheck){
			if(alreadybookcheck.room != null){
				//user already booked a room
				Rooms.findOne({id:alreadybookcheck.room}).exec(function(err,room){
                    Mess.findOne({id:alreadybookcheck.mess}).exec(function(err,mess){
                        StudentData.findOne({userid:userid}).exec(function(err,details){
                            Hostelfloors.findOne({id:room.hostelfloors}).exec(function(err,hostelfloor){
                                Hostel.findOne({id:hostelfloor.hostel}).exec(function(err,hostel){
                                    return res.view('booked',{room:room.roomno,hostel_name:hostel.name,block:hostelfloor.block,floor:hostelfloor.floor, mess:mess.name ,reg_no:details.registration_number,name: details.name});
                                })
                            });
                        });
                    });
                });
			}
			else{
				Rooms.findOne({roomno: roomno}).exec(function(err, result){
					if(result.allotted == 1){
						sails.log("Room is ALREADY BOOKED,book another");
						return res.redirect("/bookroom");
					}
					valuestoset = {room: result.id};
					Rmr_student_groups_members.findOne({userid: userid}).exec(function(err,groupid){
						if(err){
							return res.serverError(err);
						}
						if(groupid){
							var rms =[];
							Rmr_student_groups_members.find({group_id: groupid.group_id}).exec(function(err, roommates){
								if(err){
									return res.serverError(err);
								}
								for (var i = 0; i < roommates.length; i++) {
									rms[i] = roommates[i].userid;
								}
								inclause = "(";
								for (var i = 0; i < rms.length - 1; i++) {
									inclause = inclause + rms[i] + ","; 
								}
						  		inclause = inclause + rms[rms.length-1] + ")";
								var query = "SELECT name,userid from studentdata where userid in "+inclause;
								StudentData.query(query,[], function(err, names){
									//for sending names and ids to mess page
									for (var i = 0; i < roommates.length; i++) { 
										criteria = {studentdata: roommates[i].userid};
										Allotment.update(criteria, valuestoset).exec(function(err, result1){
											if(err){
												return res.serverError(err1);
											}
										});
									}	

									result.noofbedsleft -= roommates.length;
									if(result.noofbedsleft == 0){
										result.allotted = 1;
									}

									result.save(function(err){
										if(err){
											return res.serverError(err);
										}
										sails.sockets.broadcast('rooms', 'new_entry', roomno);
									});

									Messtypeid.find({studenttypeid: req.session.studenttypeid}).exec(function(err3, result3){
									  	if(err3){
											return res.serverError(err3);
										}
										sails.log(result3);	
										var messesid=[];
										for (var i = 0; i < result3.length; i++) {
									  		messesid[i] = result3[i].mess;
										}
									  	sails.log(messesid);
									 	inclause = "(";
									  	for (var i = 0; i < messesid.length - 1; i++) {
								  			inclause = inclause + messesid[i] + ","; 
								  		}
								  		inclause = inclause + messesid[messesid.length-1] + ")";
								  		query = "SELECT * from mess where id in" + inclause;
								  		Mess.query(query, [], function(err4, result4){
								  			if(err4){
								  				return res.serverError(err4)
								  			}
								  			sails.log(result4);	
								  			sails.log(names);	  					
											return res.view('choosemessgroup',{messes : result4, names: names});
										});	
									});	
								}); 
							});
								
						}
						else{
							sails.log("1234");
							criteria =  {studentdata: userid};
							Allotment.update(criteria, valuestoset).exec(function(err, result1){
								if(err){
									return res.serverError(err);
								}
								result.noofbedsleft--;
								if(result.noofbedsleft == 0){
									result.allotted = 1;
								}
								result.save(function(err){
									if(err){
										return res.serverError(err);
									}
									sails.log("2345");
									sails.sockets.broadcast('rooms', 'new_entry', roomno);
								});
								Messtypeid.find({studenttypeid: req.session.studenttypeid}).exec(function(err3, result3){
								  	if(err3){
										return res.serverError(err3);
									}
									sails.log("3456");
									sails.log(result3);	
									var messesid=[];
									for (var i = 0; i < result3.length; i++) {
								  		messesid[i] = result3[i].mess;
									}
								  	sails.log(messesid);
								 	inclause = "(";
								  	for (var i = 0; i < messesid.length - 1; i++) {
							  			inclause = inclause + messesid[i] + ","; 
							  		}
							  		inclause = inclause + messesid[messesid.length-1] + ")";
							  		query = "SELECT * from mess where id in" + inclause;
							  		Mess.query(query, [], function(err4, result4){
							  			if(err4){
							  				return res.serverError(err4)
							  			}
							  			sails.log(result4);		  					
										return res.view('choosemess',{messes : result4});
									});	
								});	
							});
						}
					});
				});
			}
		});
	}
	else{
		return res.redirect('/');
	}
},

bookmess:function(req,res){
	if(req.session.me)
	{
		var messid = req.param('messid');
		var userid = req.session.me;
		var criteria = {studentdata: userid};
		var valuestoset = {mess: messid};
		console.log(messid);
		Allotment.update(criteria, valuestoset).exec(function(err1, result1){
			if(err1) {
				return res.serverError(err1);
			}
			sails.log(result1[0].room);
			Mess.findOne({id:messid}).exec(function(err2, result2) {
				if(err2){
					return res.serverError(err);
				}
				sails.log(result2);
				result2.allotted++;
	  			result2.save(function(err2) { /* updated user */ 
	  				Rooms.findOne({id:result1[0].room}).exec(function(err,room){
                        StudentData.findOne({userid:userid}).exec(function(err,details){
                            Hostelfloors.findOne({id:room.hostelfloors}).exec(function(err,hostelfloor){
                                Hostel.findOne({id:hostelfloor.hostel}).exec(function(err,hostel){
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
		sails.log("rrrr"); 
		sails.log(data);
		var str = '';
		str = str + req.session.me;
		var index = data.userid.indexOf(str);
		sails.log(index);
		var mess1 = data.student[index];
		sails.log(mess1);

		for (var i = 0; i < data.student.length; i++) {
			// var flag =0;
			sails.log("boom");
			var messid = data.student[i];
			var userid = data.userid[i];
			var criteria = {studentdata: userid};
			var valuestoset = {mess: messid};
			// sails.log(messid);
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
		Allotment.findOne({studentdata:req.session.me}).exec(function(err,allot){
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
		// sails.log(result);
		for (var i = 0; i < result.length; i++) {
			//sails.log(result[i].id);
			Allotment.create({studentdata: result[i].userid, room: null, mess: null}).exec(function(err, sample) {

			    if (err) {return res.serverError(err);}
			   	sails.log(sample);
			    return res.redirect('/');

			});
		}

		
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
			  		Admissiontype.findOne({admissiontype: 'JEE'}).exec(function(err4, result4){
			  			if(err4){
			  				return res.serverError(err4);
			  			}
			  			
			  			Studenttypeid.findOne({gender: result3.id, courseyear: result2.id, admissiontype: result4.id}).exec(function(err5, result5){
			  				if(err5){
					  			return res.serverError(err5);
					  		}
			  				sails.log(result5.id);
							Rmr_student_groups_members.findOne({userid: req.session.me}).exec(function(err,admin){
								if(!admin){
						            Messtypeid.find({studenttypeid: result5.id}).exec(function(err, result6){
									  	if(err){
											return res.serverError(err);
										}
										sails.log(result6);	
										var messesid=[];
										for (var i = 0; i < result6.length; i++) {
									  		messesid[i] = result6[i].mess;
										}
									  	sails.log(messesid);
									 	inclause = "(";
									  	for (var i = 0; i < messesid.length - 1; i++) {
								  			inclause = inclause + messesid[i] + ","; 
								  		}
								  		inclause = inclause + messesid[messesid.length-1] + ")";
								  		query = "SELECT * from mess where id in" + inclause;
								  		Mess.query(query, [], function(err, result7){
								  			if(err){
								  				return res.serverError(err)
								  			}
								  			sails.log(result7);		  					
											return res.view('choosemess',{messes : result7});
										});	
									});	
						        }
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
											inclause = inclause + rms[i] + ","; 
										}
								  		inclause = inclause + rms[rms.length-1] + ")";
										var query = "SELECT name,userid from studentdata where userid in "+inclause;
										StudentData.query(query,[], function(err, names){
											//for sending names and ids to mess page
											Messtypeid.find({studenttypeid: result5.id}).exec(function(err, result6){
											  	if(err){
													return res.serverError(err);
												}
												sails.log(result6);	
												var messesid=[];
												for (var i = 0; i < result6.length; i++) {
											  		messesid[i] = result6[i].mess;
												}
											  	sails.log(messesid);
											 	inclause = "(";
											  	for (var i = 0; i < messesid.length - 1; i++) {
										  			inclause = inclause + messesid[i] + ","; 
										  		}
										  		inclause = inclause + messesid[messesid.length-1] + ")";
										  		query = "SELECT * from mess where id in" + inclause;
										  		Mess.query(query, [], function(err, result7){
										  			if(err){
										  				return res.serverError(err)
										  			}
										  			sails.log(result7);	
										  			sails.log(names);	  					
													return res.view('choosemessgroup',{messes : result7, names: names});
												});	
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
}
else{
	return res.redirect('/');
}
},

mygroup: function(req,res){
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
			  		Admissiontype.findOne({admissiontype: 'JEE'}).exec(function(err4, result4){
			  			if(err4){
			  				return res.serverError(err4);
			  			}
			  			
			  			Studenttypeid.findOne({gender: result3.id, courseyear: result2.id, admissiontype: result4.id}).exec(function(err5, result5){
			  				if(err5){
					  			return res.serverError(err5);
					  		}
			  				sails.log(result5.id);
							Rmr_student_groups_members.findOne({userid: req.session.me}).exec(function(err,admin){
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
										inclause = inclause + rms[i] + ","; 
									}
							  		inclause = inclause + rms[rms.length-1] + ")";
									var query = "SELECT name,userid from studentdata where userid in "+inclause;
									StudentData.query(query,[], function(err, names){
										//for sending names and ids to mess page
										return res.view('my_group',{names: names});
											
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
		return res.redirect('/');
}

};
