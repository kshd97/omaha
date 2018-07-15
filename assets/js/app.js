var roomApp = angular.module('roomApp', ['ngResource', 'angularMoment', 'ngAnimate']);

roomApp.controller('RoomCtrl', ['$scope', '$resource', '$timeout', '$rootScope','$window', function($scope, $resource, $timeout, $rootScope, $window) {
  
  io.socket.get('/rooms/subscribe', function(data, jwr) {
    io.socket.on('new_entry', function(entry) {
      $timeout(function() {
        console.log(entry);
        $scope.noofbedsleft = $resource('/rooms/:noofbedsleft').query({roomno:entry});
        $scope.noofbedsleft.$promise.then(function(result){
          console.log(result[0].noofbedsleft+" "+ $rootScope.group_size);
          if($rootScope.group_size>result[0].noofbedsleft){
            $rootScope.roomEntries.splice($rootScope.roomEntries.indexOf(entry), 1);
          }  
        }); 
        
      });
    });
    // io.socket.on('room_entry', function(room){
    //   $timeout(function(){
    //     $rootScope.roomnames.unshift(room);
    //   });
    // });
  });
  $scope.thisroomismine = function(roomno){
    console.log("KGFJH");
    //var a = $rootScope.roomnames.indexOf(roomno);

    $scope.room = $resource('/rooms').query({roomno:roomno});
    $scope.room.$promise.then(function(result){
      console.log(result[0]);
      if(result[0].allotted == 0){
        $window.location.href = "/book/"+roomno;
      }
      else{
        alert("ALready booked");
      }
    });
  };  
}]);
roomApp.controller('RoomCtrl1', ['$scope', '$resource', '$timeout', '$rootScope', function($scope, $resource, $timeout, $rootScope) {
	$scope.showRooms = function(floor, group_size){
		var final ={};
    //$rootScope.roomnames = [];
    console.log("hgsdhgjhgs");
    console.log(group_size);
    $rootScope.group_size=group_size;
		var host = angular.element(document.getElementById("hostel"));
  	var blockfloor = angular.element(document.getElementById("floor"));
  	var str = blockfloor[0].value.split(' ');
  	//console.log(str);
  	final.name = host[0].value;
  	final.block = str[2];
  	final.floor = str[6];
    if (final.block == "null") {
      final.block = null;
    }
    var roomEntries = [];
    $scope.hostelid = $resource('/hostel').query({name: final.name});
    $scope.hostelid.$promise.then(function(result){
      console.log(result[0].id);
  	  $scope.hostelfloor = $resource('/hostelfloors/:id').query({hostel:result[0].id , block: final.block, floor: final.floor})
      console.log($scope.hostelfloor);
      $scope.hostelfloor.$promise.then(function(result1){
        console.log(result1[0].id);  
        $scope.roomlist = $resource('/rooms').query({hostelfloors: result1[0].id, allotted: 0, conditionid: 1});
        $scope.roomlist.$promise.then(function(result2){
          for (var i = 0; i < result2.length; i++) {
            console.log(result2[i].roomno);
            //var single = {id: result2[i].id, roomno: result2[i].roomno};
            if(result2[i].noofbedsleft>=group_size){
              roomEntries.unshift(result2[i].roomno);
              // for (var i = 0; i < 10 ; i++) {
              //    roomEntries.unshift("1100");            
              // }
            }
          }
          //console.log(roomEntries);
          $rootScope.roomEntries = roomEntries;
          console.log("ROOT");
          console.log($rootScope.roomEntries);
        });
      });
  
		});
  }
}]);
