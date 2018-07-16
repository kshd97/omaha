function ShowFloors(hostel, hostelsfromcon) {
        var objFloor = document.getElementById("floor");
        objFloor.options.length = 0;
        objFloor.disabled = false;
        console.log(hostelsfromcon);
        objFloor.options.add(new Option("Select Block and Floor"));

        // alert("there");

        // <%= hostelsfromcon.forEach(function(value, key){ %>
        //   <% if(key == hostel.value) { %>
        //     <% for(var i=0; i< value.length; i++){ %>
        //       objFloor.options.add(new Option("HFJH"));
        //     <% } %>
        //   <% } %>
        // <% }); %>

        for(var i in hostelsfromcon) { 
          for(var j in hostelsfromcon[i]){
            
            // console.log(hostelsfromcon[i][j][1]);
            for(var k in hostelsfromcon[i][j][1]){
            //   console.log("HEYYY");
              if(hostelsfromcon[i][j][1][k].name == hostel.value){
                var name = "";

                name = name + "BLOCK : " +  hostelsfromcon[i][j][1][k].block + " , " + "FLOOR : " + hostelsfromcon[i][j][1][k].floor;

                objFloor.options.add(new Option(name));
              }
            }
          } 
        }

};

function startallot(id) {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  // Get the output text
  var text = document.getElementById("text");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text.style.display = "block";
    io.sockets.broadcast('rooms', 'new_id', id);
  } else {
    text.style.display = "none";
  }
}
// function showRooms(hostelfloor){
//   var final ={};
//   var str = hostelfloor.value.split(' ');
//   var host = document.getElementById("hostel");
//   final.name = host.options[host.selectedIndex].text;
//   final.block = str[0];
//   final.floor = str[2];
//   console.log(final);

//   var socket = io();
//   socket.emit('getrooms', {"hostelfloor": final});
// }
