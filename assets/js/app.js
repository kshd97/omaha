var roomApp = angular.module('roomApp', ['ngResource', 'angularMoment', 'ngAnimate']);

roomApp.controller('RoomCtrl', ['$scope', '$resource', '$timeout', function($scope, $resource, $timeout) {
  $scope.roomEntries = $resource('/rooms').query();

  io.socket.get('/rooms/subscribe', function(data, jwr) {
    io.socket.on('new_entry', function(entry) {
      $timeout(function() {
        $scope.feedEntries.unshift(entry);
      });
    });
  });
}]);
