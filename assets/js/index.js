function ShowFloors(hostel, hostelsfromcon) {
        var objFloor = document.getElementById("floor");
        objFloor.options.length = 0;
        objFloor.disabled = false;
        console.log(hostelsfromcon);

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
                name = name + hostelsfromcon[i][j][1][k].block + " BLOCK  " + hostelsfromcon[i][j][1][k].floor + " FLOOR";
                objFloor.options.add(new Option(name));
              }
            }
          } 
        }


      //   switch (objLanguage.value) {
      //   case "English":
      //       objMedia.options.add(new Option("The Indian Express"));
      //       objMedia.options.add(new Option("The Hindu"));
      //       break;
      //   case "Tamil":
      //       objMedia.options.add(new Option("Tamil Paper 1"));
      //       objMedia.options.add(new Option("Tamil Paper 2"));
      //       break;
      //   case "Telugu":
      //       objMedia.options.add(new Option("Telugu Paper 1"));
      //       objMedia.options.add(new Option("Telugu Paper 2"));
      //       break;
      //   default:
      //       objMedia.options.add(new Option("select"));
      //       objMedia.disabled = true;
      //       break;
      //   }
}