var roomApp = angular.module('roomApp', ['ngResource', 'angularMoment', 'ngAnimate']);

roomApp.controller('RoomCtrl', ['$scope', '$resource', '$timeout', function($scope, $resource, $timeout) {
  

  io.socket.get('/rooms/subscribe', function(data, jwr) {
    io.socket.on('new_entry', function(entry) {
      $timeout(function() {
        $scope.roomEntries.unshift(entry);
      });
    });
  });
  $scope.roomEntries = $resource('/rooms').query({hostelfloors: 1});
  
  io.socket.get('/rooms/subscribe1', function(data, jwr){
  	io.socket.on('getrooms', function(entry){
	  	$timeout(function(){
	  		// console.log("HEYY");
	  	});
  	});
  });
  
}]);
