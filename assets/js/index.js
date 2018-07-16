// function ShowFloors(hostel, hostelsfromcon) {

//     var objFloor = document.getElementById("floor");
//     objFloor.options.length = 0;
//     objFloor.disabled = false;

//     objFloor.options.add(new Option("Select Block and Floor"));

//     for(var i in hostelsfromcon) 
//     { 
//       for(var j in hostelsfromcon[i])
//       {
//         for(var k in hostelsfromcon[i][j][1])
//         {
//             console.log(hostelsfromcon[i][j][1][k].name + " is but " + hostel.value);
//           if(hostelsfromcon[i][j][1][k].name.trim() == hostel.value)
//           {
//             console.log(hostelsfromcon[i][j][1][k].block + " is ");
//             var name = "";
//             name = name + "BLOCK : " +  hostelsfromcon[i][j][1][k].block + " , " + "FLOOR : " + hostelsfromcon[i][j][1][k].floor;
//             objFloor.options.add(new Option(name));
//           }
//         }
//       } 
//     }
// };
 
 
// function thisroomismine(roomno){
//     console.log("KGFJH");

//     $.ajax({

//         type: "GET",
//         url: "http://172.20.29.31:8080/rooms",
//         dataType: "json",
//         data: {roomno: roomno}
//     }).done(function(resu) {

//             if(resu[0].allotted == 0)
//             {


//                 window.location.href = "/book/"+roomno;
//             }
//             else
//             {
//                 alert("Already booked");
//             }
//     });
//   };

// function showRooms(hostelfloor){
//   var final ={};
//   var str = hostelfloor.value.split(' ');
//   var host = document.getElementById("hostel");
//   final.name = host.options[host.selectedIndex].text;
//   final.block = str[2];
//   final.floor = str[6];

//   if(final.block == "null")
//     final.block = null;

//   var availrooms = [];

//     $.ajax({
//         type: "GET",
//         url: "http://172.20.29.31:8080/hostel",
//         dataType: "json",
//         data: {name: final.name}
//      }).done(function(resu)
//         {

//                $.ajax({
//                 type: "GET",
//                 url: "http://172.20.29.31:8080/hostelfloors",
//                 dataType: "json",
//                 data: {hostel: resu[0].id, block: final.block, floor: final.floor}
//             }).done(function(resu2) {

        
//                 $.ajax({
//                     type: "GET",
//                     url: "http://172.20.29.31:8080/rooms",
//                     dataType: "json",
//                     data: {hostelfloors: resu2[0].id, allotted: 0, conditionid: 1}
//                 }).done(function(resu3) {

            
//                     $('#roomsdiv').empty();
//                     for(var i = 0; i < resu3.length; i++)
//                     {
//                         console.log(resu3[i].roomno);
//                         $('#roomsdiv').append("<div class='col-sm-2' style='margin-top: 20px;'> <button class='ui small black button' onclick=\"thisroomismine('" + resu3[i].roomno + "');\">" + resu3[i].roomno + "</button> </div>");
//                     }  
//                 });
//             });
//         });
// };
