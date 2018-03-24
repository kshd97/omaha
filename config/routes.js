

module.exports.routes = {


  '/': { view: 'login' },
  '/dashboard': { view: 'dashboard' },
  '/fail': { view: 'fail' },

  'post /login': 'UsersController.login',



};
