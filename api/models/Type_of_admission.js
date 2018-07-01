/**
 * Type_of_admission.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'type_of_admission',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    reg_no: {
            type: 'string'
            // primaryKey: true
        },
    
    admissiontypeid: {
            type: 'integer'
        },
    
    id: {
		type: 'string',
		columnName: 'reg_no',
		required: true,
		primaryKey: true
	}
	
  },

};

