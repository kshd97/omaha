module.exports = {

  attributes: {
  	sender:{
  		type: "integer"
  	},
  	receiver: {
  		type: "integer"
  	},
  	status:{ 
  		type: "integer" //accepted = 1 declined = 2 otherwise null
  	}
  }
};
