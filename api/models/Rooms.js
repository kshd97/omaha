/**
 * Rooms.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		hostelfloors: {
  			model: 'hostelfloors'
  		},
  		roomno: {
        type: 'string'
  		},
  		capacity: {
  			type: 'integer'
  		},
  		conditionid: {          // 1 is good 0 is bad
  			type: 'integer'
  		},
  		allotted: {            // 1 is allotted 0 is not
  			type: 'integer'
  		}
  },

  afteUpdate: function(entry, cb) {
    console.log("HEY BROTHEr");
    sails.sockets.broadcast('room', 'new_entry', entry);
    cb();
  },
};

