/**
 * Admissiontype.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	admissiontype: {
            type: "string",
            enum: ['1','2'], //1 jee 2 dasa
        },

  }
};

