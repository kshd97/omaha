module.exports = {

  tableName: 'rmr_student_requests',
  attributes: {
  	sender:{
  		type: "string"
  	},
  	receiver: {
  		type: "string"
  	},
  	status:{ 
  		type: "integer" //accepted = 1 declined = 2 otherwise null
  	}
  }
};
