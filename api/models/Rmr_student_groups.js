/**
 * Rmr_student_groups.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	group_id:{
  		type: "integer"
  	},
  	group_name:{
  		type: "string"
  	},
  	group_size:{
  		type: "integer"
  	}
  }
};

