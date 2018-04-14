var roomApp = angular.module('roomApp', ['ngResource', 'angularMoment', 'ngAnimate']);

roomApp.controller('RoomCtrl', ['$scope', '$resource', '$timeout', function($scope, $resource, $timeout) {
  

  //console.log("fsygfdhy");
  //var final ={};
  //onsole.log($scope.floor);
  //var str = hostelfloor.value.split(' ');
  //var host = angular.element(document.getElementById("hostel"));
  //var blockfloor = angular.element(document.getElementById("floor"));
  //console.log(blockfloor);
  //var str = blockfloor.value.split(' ');
  // final.name = host.options[host.selectedIndex].text;
  // final.block = str[0];
  // final.floor = str[2];
  // console.log("jfdkjfdk");
  // console.log(final);

  // $scope.hostelfloor = $resource('/hostelfloors').query({hostel: final.name, block: final.block, floor: final.floor});
  // $scope.roomEntries = $resource('/rooms').query({hostelfloors: $scope.hostelfloor});
  // console.log()
  
}]);
roomApp.controller('RoomCtrl1', ['$scope', '$resource', '$timeout', function($scope, $resource, $timeout) {
	$scope.showRooms = function(floor){
		var final ={};
		var host = angular.element(document.getElementById("hostel"));
  	var blockfloor = angular.element(document.getElementById("floor"));
  	var str = blockfloor[0].value.split(' ');
  	//console.log(str);
  	final.name = host[0].value;
  	final.block = str[0];
  	final.floor = str[2];
    io.socket.get('/rooms/subscribe', function(data, jwr) {
      console.log("BOOM"+ jwr);
      io.socket.on('new_entry', function(entry) {
        console.log("HEYYYEY");
        $timeout(function() {
          $scope.roomEntries.unshift(entry);
        });
      });
    });
		// console.log(host[0].value );
		// console.log(blockfloor[0].value);
		// $scope.roomEntries = $resource('/gender').query();
		// console.log("FFF" + $scope.roomEntries);
    $scope.hostelid = $resource('/hostel').query({name: final.name});
    $scope.hostelid.$promise.then(function(result){
      //console.log(result[0].id);
	  $scope.hostelfloor = $resource('/hostelfloors/:id').query({hostel:result[0].id , block: final.block, floor: final.floor})
    console.log($scope.hostelfloor);
    $scope.hostelfloor.$promise.then(function(result1){
      console.log(result1[0].id);  
      $scope.roomEntries = $resource('/rooms').query({hostelfloors: result1[0].id, allotted: 0, conditionid: 1});
      console.log($scope.roomEntries);
    });
  });
    
		
    //console.log($scope.roomEntries);
}

}]);
