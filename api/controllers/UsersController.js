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

    var bcrypt = require('bcrypt');
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

                    return res.redirect('/dashboard');
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

};