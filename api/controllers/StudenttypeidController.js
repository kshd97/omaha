/**
 * StudenttypeidController
 *
 * @description :: Server-side logic for managing studenttypeids
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
       
       	sails.log("HRIHGI"); 
		Gender.find().exec(function(err, allgen){
			if(err){
				return res.serverError(err);
			}
			sails.log(allgen.length);
			Courseyear.find().exec(function(err, allcou){
				if(err){
					return res.serverError(err);
				}
				sails.log(allcou.length);
				Admissiontype.find().exec(function(err, alladm){
					if(err){
						return res.serverError(err);
					}
					for (var i = 0; i < allgen.length ; i++) {
						for (var j = 0; j < allcou.length; j++) {
							for (var k = 0; k < alladm.length; k++){
								var insert = "INSERT INTO studenttypeid (gender, courseyear, admissiontype) VALUES("+allgen[i].id+", "+allcou[j].id+", "+alladm[k].id+")";
								Studenttypeid.query(insert,[],function(err,record){
						            if(err)
						            {
						                console.log(err);
						            }
						            else
						            {
						                console.log(record);
						            }
						        });
							}
						}
					}
				});
			});
		});

        
        res.redirect('/dashboard');
    },
	
};

