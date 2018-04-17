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

        sails.log("I am a debug message");
        Users.findOne({
            username: req.param('username'),
        }).exec(function(err, result){
            if (err) return res.negotiate(err);

            sails.log(result.password);
            bcrypt.compare(password, result.password, function(err, res1) {
                if(res1) {
                    sails.log("Matched");
                    req.session.me = result.id;
                    sails.log(req.session.me);
                    Rmr_student_groups_members.findOne({userid: result.id}).exec(function(err,admin){
                        if(admin.is_group_admin == 1)
                            return res.redirect('/dashboard');
                        else
                            return res.redirect('/notallowed');
                    });

                    
                }
                else{
                    sails.log("Incorrect");
                    return res.redirect('/fail');
                }
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