/**
 * Users
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    index: function(req, res, next) {
        Users.find().exec(function(err, list) {
            if (err) return Error('Error');
            return res.view({
                result: list
            });
        });
    },

    show: function(req, res, next) {
        Users.findOneById(req.param('id'), function Founded(err, value) {
            if (err) {
                return next(err);
            }
            res.view({
                element: value
            });
        });
    },

    edit: function(req, res, next) {
        Users.findOne(req.param('id'), function Founded(err, value) {
            if (err) {
                return next(err);
            }
            res.view({
                element: value
            });
        });
    },

    update: function(req, res, next) {
        Users.update(req.param('id'), req.body, function Update(err, value) {
            if (err) {
                return next(err);
            }
            return res.redirect('users/show/' + req.param('id'));
        });
    },

    delete: function(req, res, next) {
        Users.destroy(req.param('id'), function Update(err, value) {
            if (err) {
                return next(err);
            }
            return res.redirect('/users');
        });
    },

    login: function (req, res) {

        var bcrypt = require('bcryptjs');
        var password = req.param('password'); 
        var username = req.param('username');
        Users.findOne({ or: [{username: username},{email:username}]}).exec(function(err, result){
            if (err || result == undefined) {
                return res.view('fail', {message: "Your username was not found"});
             }
            // sails.log(result);
            bcrypt.compare(password, result.password, function(err, res1) {
            	if(res1){
                    req.session.me = result.id;
                    // return res.view('rmr_instructions');      
                    
                    StudentData.findOne({userid:result.id}).exec(function (err, re){
                        if (err || re==undefined) {
                            return res.view('fail', {message: "Your ID was not found"});
                        }
                        req.session.registration_number = re.registration_number;
                        // sails.log(re.registration_number + " has logged");

                        //var fs = require("fs");
                        //var data = fs.readFileSync("rmr_eligible.csv");
                        //var studs = data.toString().split('\n');

                        // var flag = 0;
                        // for(var i = 0; i < studs.length; i++)
                        // {
                        //     if(studs[i] == re.registration_number)
                        //     {   
                        //         sails.log("jijii");
                        //         flag = 1;
                        //         break;
                        //     }
                        // }
                        var flag =1;

                        if(flag == 1)
                        {
                            Type_of_admission.findOne({reg_no: re.registration_number}).exec(function(error11, result11) {
                                if(error11 || result11 == undefined){
                                    return res.view('fail',{message: "Reg no not in Type_of_admission. To rectify, go to http://wsdc.nitw.ac.in:8080/addToDb"});
                                }

                                // sails.log(result11.admissiontypeid);
                                // if(re.gender == "F" || (re.gender == "M" && (re.current_year == 2 || re.current_year == 3) && result11.admissiontypeid == 1 && re.course=='btech'))
                                if(false) 
                                    return res.view('rmr_instructions', {first_name: re.name});
                                else
                                {
                                    //return res.view('fail', {message: "Not your time to login."});
                                    Course.findOne({course: re.course}).exec(function(err1, re1){
                                        if(err1){ 
                                            return res.view('fail', {message: "Invalid course"});
                                        }
                                        var year = parseInt(re.current_year);
                                        Courseyear.findOne({course: re1.id, year: year}).exec(function(err2, re2){
                                            if(err2){
                                                return res.view('fail', {message: "Invalid year"});
                                            }
                                            Gender.findOne({gender: re.gender}).exec(function(err3, re3){
                                                if(err3){
                                                    return res.view('fail', {message: "Invalid gender"});
                                                }
                                                sails.log("here dddd");
                                                Type_of_admission.findOne({reg_no: re.registration_number}).exec(function(err, admissiontype){
                                                    if (err) {
                                                        return res.view('fail', {message: "Invalid admission type"});
                                                    }

                                                    sails.log("it'sssssss" + admissiontype.admissiontypeid);
                                                    Admissiontype.findOne({admissiontype: admissiontype.admissiontypeid}).exec(function(err4, re4){
                                                        if(err4){
                                                            return res.view('fail', {message: "Invalid admission type"});
                                                        }
                                                        sails.log("re3 is " + re3);
                                                        sails.log("re2 is " + re2);
                                                        sails.log("re4 is " + re4);
                                                        Studenttypeid.findOne({gender: re3.id, courseyear: re2.id, admissiontype: admissiontype.admissiontypeid}).exec(function(err5, re5){
                                                            if(err5){
                                                                return res.view('fail', {message: "Invalid gender"});
                                                            }
                                                            sails.log(re5.id);
                                                            sails.log(Global.idlist);
                                                            if(Global.idlist.indexOf(re5.id) != -1){   
                                                                // sails.log("Matched");
                                                                req.session.me = result.id;
                                                                // sails.log(req.session.me);
                                                                sails.log(result.id);
                                                                Allotment.findOne({studentdata: re.registration_number}).exec(function(err, result1){
                                                                    if(!result1.room && !result1.mess){
                                                                        Rmr_student_groups_members.findOne({userid: re.registration_number}).exec(function(err,admin){
                                                                            if(!admin){
                                                                                return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                                            }
                                                                            if(admin.is_group_admin == 1)
                                                                                return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                                            else
                                                                                return res.view('notallowed', {first_name: result.first_name, last_name: result.last_name});
                                                                        });        
                                                                    }
                                                                    else if(!result1.mess){
                                                                        Rmr_student_groups_members.findOne({userid: result.id}).exec(function(err,admin){
                                                                            // sails.log(admin);
                                                                            if(admin == null){
                                                                                return res.redirect('onlymess');
                                                                            }
                                                                            else{
                                                                                if(admin.is_group_admin == 1)
                                                                                    return res.redirect('onlymess');
                                                                                else
                                                                                    return res.view('notallowed', {first_name: result.first_name, last_name: result.last_name});
                                                                            }
                                                                        });        

                                                                    }
                                                                    else{
                                                                        Rooms.findOne({id:result1.room}).exec(function(err,room){
                                                                            Mess.findOne({id:result1.mess}).exec(function(err,mess){
                                                                                StudentData.findOne({userid:result.id}).exec(function(err,details){
                                                                                    Hostelfloors.findOne({id:room.hostelfloors}).exec(function(err,hostelfloor){
                                                                                        Hostel.findOne({id:hostelfloor.hostel}).exec(function(err,hostel){
                                                                                            return res.view('booked',{room:room.roomno,hostel_name:hostel.name,block:hostelfloor.block,floor:hostelfloor.floor, mess:mess.name ,reg_no:details.registration_number,name: details.name});
                                                                                        })
                                                                                    });
                                                                                });
                                                                            });
                                                                        }); 
                                                                    }
                                                                });
                                                            }
                                                            else{
                                                                return res.view('fail', {message: "Not your time to book"});
                                                            }
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                            });
                        }
                        else
                        {
                            return res.view('fail', {message: "Ineligible for RMR."});    
                        }
                    }); 
                }                                           
                else{ 
                    return res.view('fail', {message: "Wrong password."});  
                }
            });
        });

    },

    forgotPasswd: function(req, res) {

        if(req.method == 'GET')
        {
            return res.view('forgotPasswd');
        }
        else
        {
            var usernm = req.param('usernm');

            Users.findOne({ or: [{username: usernm},{email:usernm}]}).exec(function(err, result) {

                if(err || !result)
                {
                    return res.view('fail', {message: 'Invalid username / email'});
                }
                else
                {
                    var q = "UPDATE users SET password = '$2y$08$tk4lFKhB.ylklzbyHySuguUBbdwUhxy7vyihwCPl80LMlE.3vwele' WHERE id = " + result.id;

                    Users.query(q, function(err3, res3) {

                        if(err3)
                        {
                            return res.view('fail', {message: 'Could not update password'});
                        }
                        else
                        {
                            return res.redirect('/');
                        }
                    });                    
                }
            });
        }
    },

    gotoDash: function(req, res) {
	if(req.session.me){

        // return res.redirect('/dashboard');
        Users.findOne({id: req.session.me}).exec(function(err, result){
            if(err || result == undefined){
                return res.view('fail', {message: "Users id not found"});
            }  
                    
            StudentData.findOne({userid:result.id}).exec(function (err, re){
                if (err || re ==undefined) {
                    return res.view('fail', {message: "Invalid ID"});
                }
                // sails.log(re.registration_number);

                // var fs = require("fs");
                // var data = fs.readFileSync("rmr_eligible.csv");
                // var studs = data.toString().split('\n');

                var flag = 1;
                // for(var i = 0; i < studs.length; i++)
                //     if(studs[i] == re.registration_number)
                //     {
                //         flag = 1;
                //         break;
                //     }

                if(flag == 1)
                {
                    Type_of_admission.findOne({reg_no: re.registration_number}).exec(function(error12, result12) {
                        if(error12 || result12 == undefined){
                            return res.view('fail', {message: "NO type of admission"});
                        }
                        
                            // if(re.gender == "F" || (re.gender == "M" && (re.current_year == 2 || re.current_year == 3) && result12.admissiontypeid == 1 && re.course=='btech'))
                                if(false)                            
                                    return res.view('rmr_instructions', {first_name: re.name});                                   
                        else
                        {
				            //return res.view('fail',{message:"Not your time to book"});
                            Course.findOne({course: re.course}).exec(function(err1, re1){
                                if(err1){ 
                                    return res.view('fail', {message: "Invalid course"});
                                }
                                var year = parseInt(re.current_year);
                                Courseyear.findOne({course: re1.id, year: year}).exec(function(err2, re2){
                                    if(err2){
                                        return res.view('fail', {message: "Invalid year"});
                                    }
                                    Gender.findOne({gender: re.gender}).exec(function(err3, re3){
                                        if(err3){
                                            return res.view('fail', {message: "Invalid gender"});
                                        }
                                        // sails.log("here dddd");
                                        Type_of_admission.findOne({reg_no: re.registration_number}).exec(function(err, admissiontype){
                                            if (err) {
                                                return res.view('fail', {message: "Invalid admission type"});
                                            }

                                            // sails.log("it'sssssss" + admissiontype.admissiontypeid);
                                            Admissiontype.findOne({admissiontype: admissiontype.admissiontypeid}).exec(function(err4, re4){
                                                if(err4){
                                                    return res.view('fail', {message: "Invalid admission type"});
                                                }
                                                // sails.log("re3 is " + re3);
                                                // sails.log("re2 is " + re2);
                                                // sails.log("re4 is " + re4);
                                                Studenttypeid.findOne({gender: re3.id, courseyear: re2.id, admissiontype: admissiontype.admissiontypeid}).exec(function(err5, re5){
                                                    if(err5){
                                                        return res.view('fail', {message: "Invalid student type"});
                                                    }
                                                    // sails.log(re5.id);
                                                    // sails.log(Global.idlist);
                                                    if(Global.idlist.indexOf(re5.id) != -1){   
                                                        // sails.log("Matched");
                                                        req.session.me = result.id;
                                                        // sails.log(req.session.me);
                                                        Allotment.findOne({studentdata: re.registration_numberd}).exec(function(err, result1){
                                                            if(err){
                                                                return res.view('fail', {message: "Invalid allotment ID"});
                                                            }
                                                            if(!result1.room && !result1.mess){
                                                                Rmr_student_groups_members.findOne({userid: re.registration_number}).exec(function(err,admin){
                                                                    if(err){
                                                                        return res.view('fail', {message: "Invalid Group Members"});
                                                                    }
                                                                    if(!admin){
                                                                        return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                                    }
                                                                    if(admin.is_group_admin == 1)
                                                                        return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                                    else
                                                                        return res.view('notallowed', {first_name: result.first_name, last_name: result.last_name});
                                                                });        
                                                            }
                                                            else if(!result1.mess){
                                                                Rmr_student_groups_members.findOne({userid: result.id}).exec(function(err,admin){
                                                                    if(err){
                                                                        return res.view('fail', {message: "Invalid Group Members"});
                                                                    }
                                                                    if(admin == null){
                                                                        return res.redirect('onlymess');
                                                                    }
                                                                    else{
                                                                        if(admin.is_group_admin == 1)
                                                                            return res.redirect('onlymess');
                                                                        else
                                                                            return res.view('notallowed', {first_name: result.first_name, last_name: result.last_name});
                                                                    }
                                                                });        

                                                            }
                                                            else{
                                                                Rooms.findOne({id:result1.room}).exec(function(err,room){
                                                                    if (err) {
                                                                        return res.view('fail', {message: "Invalid room id"});
                                                                    }
                                                                    Mess.findOne({id:result1.mess}).exec(function(err,mess){
                                                                        if (err) {
                                                                            return res.view('fail', {message: "Invalid mess id"});
                                                                        }
                                                                        StudentData.findOne({userid:result.id}).exec(function(err,details){
                                                                            if(err){
                                                                                return res.view('fail', {message: "Invalid id"});
                                                                            }
                                                                            Hostelfloors.findOne({id:room.hostelfloors}).exec(function(err,hostelfloor){
                                                                                if(err){
                                                                                    return res.view('fail', {message: "Invalid hostel flors"});
                                                                                }
                                                                                Hostel.findOne({id:hostelfloor.hostel}).exec(function(err,hostel){
                                                                                    return res.view('booked',{room:room.roomno,hostel_name:hostel.name,block:hostelfloor.block,floor:hostelfloor.floor, mess:mess.name ,reg_no:details.registration_number,name: details.name});
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                }); 
                                                            }
                                                        });
                                                    }
                                                    else{
                                                        return res.view('fail', {message: "Not your time to book"});
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    });
                }
                else
                {
                    return res.view('fail', {message: "Ineligible for RMR"});
                }
            }); 
                // }                                           
                // else{
                    // sails.log("Incorrect");
                    // return res.redirect('/fail');
                // }
            // });
        });
	}
	else{
	return res.redirect('/');
	}

    },

    logout: function(req, res){

        Users.findOne(req.session.me, function foundUser(err, user) {
            if (err) return res.view('fail', {message: "Invalid user id"});
            // If session refers to a user who no longer exists, still allow logout.
            if (!user) {
                // sails.log.verbose('Session refers to a user who no longer exists.');
                return res.backToHomePage();
            }
            // Wipe out the session (log out)
            req.session.me = null;

            // Either send a 200 OK or redirect to the home page
            return res.redirect('/');
        });
    },
};
