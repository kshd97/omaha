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
        sails.log("gdjhghgdsgd");
        var bcrypt = require('bcryptjs');
        var password = req.param('password'); 
        Users.findOne({username: req.param('username'),}).exec(function(err, result){
            if (err) return res.negotiate(err);
            sails.log(result);
            bcrypt.compare(password, result.password, function(err, res1) {
                if(res1){
                    req.session.me = result.id;
                    return res.view('rmr_instructions')
                    StudentData.findOne({userid:result.id}).exec(function (err, re){
                        if (err) {
                            return res.serverError(err);
                        }
                        Course.findOne({course: re.course}).exec(function(err1, re1){
                            if(err1){
                                return res.serverError(err1);
                            }
                            var year = parseInt(re.current_year);
                            Courseyear.findOne({course: re1.id, year: year}).exec(function(err2, re2){
                                if(err2){
                                    return res.serverError(err2);
                                }
                                Gender.findOne({gender: re.gender}).exec(function(err3, re3){
                                    if(err3){
                                        return res.serverError(err3);
                                    }
                                    Type_of_admission.findOne({reg_no: re.registration_number}).exec(function(err, admissiontype){
                                        if (err) {
                                            return res.serverError(err);
                                        }
                                        Admissiontype.findOne({admissiontype: admissiontype.admissiontypeid}).exec(function(err4, re4){
                                            if(err4){
                                                return res.serverError(err4);
                                            }
                                            Studenttypeid.findOne({gender: re3.id, courseyear: re2.id, admissiontype: re4.id}).exec(function(err5, re5){
                                                if(err5){
                                                    return res.serverError(err5);
                                                }
                                                sails.log(re5.id);
                                                sails.log(Global.idlist);
                                                if(Global.idlist.indexOf(re5.id) != -1){   
                                                    sails.log("Matched");
                                                    req.session.me = result.id;
                                                    sails.log(req.session.me);
                                                    Allotment.findOne({studentdata: result.id}).exec(function(err, result1){
                                                        if(!result1.room && !result1.mess){
                                                            Rmr_student_groups_members.findOne({userid: result.id}).exec(function(err,admin){
                                                                if(!admin){
                                                                    return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                                }
                                                                if(admin.is_group_admin == 1)
                                                                    return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                                else
                                                                    return res.view('/notallowed', {first_name: result.first_name, last_name: result.last_name});
                                                            });        
                                                        }
                                                        else if(!result1.mess){
                                                            Rmr_student_groups_members.findOne({userid: result.id}).exec(function(err,admin){
                                                                sails.log(admin);
                                                                if(admin == null){
                                                                    return res.redirect('onlymess');
                                                                }
                                                                else{
                                                                    if(admin.is_group_admin == 1)
                                                                        return res.redirect('onlymess');
                                                                    else
                                                                        return res.view('/notallowed', {first_name: result.first_name, last_name: result.last_name});
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
                                                    return res.view('notyourtime');
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
                    sails.log("Incorrect");
                    return res.redirect('/fail');
                }Admissiontype.findOne({admissiontype: 'JEE'}).exec(function(err4, re4){
                                        if(err4){
                                            return res.serverError(err4);
                                        }
                                        Studenttypeid.findOne({gender: re3.id, courseyear: re2.id, admissiontype: re4.id}).exec(function(err5, re5){
                                            if(err5){
                                                return res.serverError(err5);
                                            }
                                            sails.log(re5.id);
                                            sails.log(Global.idlist);
                                            if(Global.idlist.indexOf(re5.id) != -1){   
                                                sails.log("Matched");
                                                req.session.me = result.id;
                                                sails.log(req.session.me);
                                                Allotment.findOne({studentdata: result.id}).exec(function(err, result1){
                                                    if(!result1.room && !result1.mess){
                                                        Rmr_student_groups_members.findOne({userid: result.id}).exec(function(err,admin){
                                                            if(!admin){
                                                                return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                            }
                                                            if(admin.is_group_admin == 1)
                                                                return res.view('dashboard', {first_name: result.first_name, last_name: result.last_name});
                                                            else
                                                                return res.view('/notallowed', {first_name: result.first_name, last_name: result.last_name});
                                                        });        
                                                    }
                                                    else if(!result1.mess){
                                                        Rmr_student_groups_members.findOne({userid: result.id}).exec(function(err,admin){
                                                            sails.log(admin);
                                                            if(admin == null){
                                                                return res.redirect('onlymess');
                                                            }
                                                            else{
                                                                if(admin.is_group_admin == 1)
                                                                    return res.redirect('onlymess');
                                                                else
                                                                    return res.view('/notallowed', {first_name: result.first_name, last_name: result.last_name});
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
                                                return res.view('notyourtime');
                                            }
                                        });
                                    });
            });
        });
        // return res.login({
        //     username: req.param('username'),
        //     password: req.param('password'),
        //     successRedirect: '/dashboard',
        //     invalidRedirect: '/fail'
        // });
    },
    logout: function(req, res){

        Users.findOne(req.session.me, function foundUser(err, user) {
            if (err) return res.negotiate(err);
            // If session refers to a user who no longer exists, still allow logout.
            if (!user) {
                sails.log.verbose('Session refers to a user who no longer exists.');
                return res.backToHomePage();
            }
            // Wipe out the session (log out)
            req.session.me = null;

            // Either send a 200 OK or redirect to the home page
            return res.redirect('/');
        });
    },
};