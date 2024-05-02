

setTimeout(function() {
    document.getElementById('myAlert').style.display = 'none';
}, 5000);

function changeStatus(id,userId){
    let button = document.getElementById(id)
    if(button.innerText=='Block User'){
      button.style.backgroundColor = "blue"
      button.innerText = 'Unblock User'
      try{
        fetch("/admin/users/block/"+userId,{
          method: "PATCH",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({userid:id})
        })
        console.log("/admin/users/block/"+id);
      }
      catch(err){
        console.log(err.message);
      }
    }
    else{
      try{
        fetch("/admin/users/unblock/"+userId,{
          method: "PATCH",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({userid:id})
        })
        console.log("/admin/users/unblock/"+id);
      }
      catch(err){
        console.log(err.message);
      }
      button.style.backgroundColor = "red"
      button.innerText = 'Block User'
    }
  }


function blockCategory(id) {
    console.log("clicked....");
    $.ajax({
        url: '/admin/category/block',
        method: "patch",
        data: { id: id },
        success: function (response) {
            let categories = response.categories;
            let targetCategory = categories.find((cate) => {
                return cate._id === id;
            });

            // Update the button class and text based on the user's block status
            if (targetCategory.block == 0) {
                $(`button[data-id="${id}"]`).removeClass('btn-inverse-warning').addClass('btn-inverse-success').text('block');
            } else {
                $(`button[data-id="${id}"]`).removeClass('btn-inverse-success').addClass('btn-inverse-warning').text('unBlock');
            }
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
}



function formatDate(inputDate) {
    // Parse the input date string
    const parsedDate = new Date(inputDate);
  
    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date"; // Handle invalid input
    }
  
    // Define months for formatting
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Extract date and time components
    const day = parsedDate.getDate();
    const month = months[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();
    const hours = parsedDate.getHours();
    const minutes = parsedDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  
    // Format the date in the desired format
    const formattedDate = `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  
    return formattedDate;
  }


  function productAction(id) {
    // Send an AJAX request to update the user's block status
    const listBtn = document.getElementById(`BTN${id}`);
    $.ajax({
        url: '/admin/productlist',
        method: "post",
        data: { id: id },
        success: function (response) {
            let targetproduct = response.product;
            // let targetproduct = users.find((user) => {
            //     return user._id === id;
            // });

            // Update the button class and text based on the user's block status
            if (targetproduct.unlist == 0) {
                // listBtn.removeClass('btn-inverse-danger').addClass('btn-inverse-success').text('Unlist');
                $(`button[data-id="${id}"]`).removeClass('btn-inverse-danger').addClass('btn-inverse-success').text('Unlist');

            } else {
                // listBtn.removeClass('btn-inverse-success').addClass('btn-inverse-danger').text('List');
                $(`button[data-id="${id}"]`).removeClass('btn-inverse-success').addClass('btn-inverse-danger').text('List');
            }
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
}


