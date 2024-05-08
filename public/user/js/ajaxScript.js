function addCart(id,user) {
    function showAlertBox() {
        console.log("alert fun called...");
        $("#cartAlert").fadeIn();
    
        // Hide the alert box after 5 seconds
        setTimeout(function () {
            $("#cartAlert").fadeOut();
        }, 3000);
    }

    function showAlertBoxAlready() {
        console.log("alert fun called...");
        $("#cartAlertAlready").fadeIn();
    
        // Hide the alert box after 5 seconds
        setTimeout(function () {
            $("#cartAlertAlready").fadeOut();
        }, 3000);
    }



 
    if(user){
        $.ajax({
            url: '/home/cart',
            method: "post",
            data: { id: id,user:user },
            success: function (response) {
                console.log(response);
                if(response.cart==1){
                    showAlertBox()
                }
                if(response.cart==2){
                    showAlertBoxAlready()
                }
               
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    }else{
        window.location.href = "/login"
    }
}




function changeQty(userId,productId,qty){
    function showStockAlertBox() {
       
        $("#noStockAlert").fadeIn();
    
        // Hide the alert box after 5 seconds
        setTimeout(function () {
            $("#noStockAlert").fadeOut();
        }, 3000);
    }
    // console.log(qty);
    let totalDis = document.getElementById('totalDisplay')
    let subTotalDis = document.getElementById('subTotalDisplay')
    let singleProductTotal = document.getElementById(`singleProductTotal${productId}`)
    let qtyInput = document.getElementById(`qty${productId}`)
    let singleProductPrice =  document.getElementById(`singleProductPrice${productId}`)
    if(userId){
        $.ajax({
            url:'/changeqty',
            method:'post',
            data:{userId,productId,qty:qty},
            success:(response)=>{
                // alert(response)
                // console.log(response);
                if(response.NoStock==1){
                    showStockAlertBox()
                }else{
                
                response.total==undefined ? window.location.href='/login' :
                
                totalDis.innerHTML=response.total
                subTotalDis.innerHTML=response.total

                // console.log(response.cartItems.products);
                let newQuantity = response.cartItems.products.find(val=>val.product==productId)
                console.log(newQuantity);
                qtyInput.value=newQuantity.quantity
                singleProductTotal.innerHTML=`₹${Number(singleProductPrice.innerHTML)*Number(newQuantity.quantity)}`
                console.log(singleProductPrice.innerHTML);
            }
                
        }
    })
    }
}


function removeCartItem(user,product,qty){
    console.log(user,product,qty);
    $.ajax({
        url:'/removecartproduct',
        method:'delete',
        data:{user,product,qty},
        success:(response)=>{
            console.log(response);
            if(response.remove==1){
                location.reload()
            }
        }
    })
}

function removeAddress(id){
    console.log(id);
    $.ajax({
        url:'/profile/user_address/delete',
        method:'delete',
        data:{id},
        success:(response)=>{
            console.log(response);
            if(response.remove==1){
                location.reload()
            }
        }
    })
}


//add to wishlist
function addWishlist(productId){

    function showWishAlertBox() {
        console.log("alert fun called...");
        $("#wishAlert").fadeIn();
    
        // Hide the alert box after 5 seconds
        setTimeout(function () {
            $("#wishAlert").fadeOut();
        }, 4000);
    }

    function showWishAlertBoxAlready() {
        console.log("alert fun called...");
        $("#wishAlertAlready").fadeIn();
    
        // Hide the alert box after 5 seconds
        setTimeout(function () {
            $("#wishAlertAlready").fadeOut();
        }, 3000);
    }


    console.log(productId);
    $.ajax({
        url:'/home/account/wishlist',
        method:'post',
        data:{productId},
        success:(response)=>{
            if(response.status==1){
                showWishAlertBox()
                // alert(response.status)
            }else{
                showWishAlertBoxAlready()
                // alert(response.status)

            }
        }
    })
}


function removeWishItem(productId){
    console.log(productId);
    $.ajax({
        url:'/home/account/wishlist',
        method:"delete",
        data:{productId},
        success:(response)=>{
            if(response.status=="remove"){
                window.location.reload()
            }
        }

    })
}

// document.getElementById("couponInput").addEventListener("submit",(e)=>{
//     e.preventDefault()
//     alert("coppen called")
// })


//couponInput ,applyBtn
//apply Coupon 
// function couponApply(){
//     let code = document.getElementById("couponInput").value
//     let discount = document.getElementById("dicountDisplay")
//     let discount2 = document.getElementById("dicountDisplay2")
//     let total = document.getElementById('totalDisplay')
//     let total2 = document.getElementById('totalDisplay2')

//     let MessDis = document.getElementById('MessDis')
//     let couponInDiv = document.getElementById("couponInDiv")
//     let couponShow = document.getElementById("couponShow")
//     let appliedCouponInput = document.getElementById("couponApInput")
//     let couponPass = document.getElementById("couponPass")
//     let validMessage = document.getElementById('CouponValidMessage')
//     let couponInvalidMess = document.getElementById("couponInvalidMess")


//     // alert(couponInput)
//     $.ajax({
//         url:'/checkout/placeorder/coupon',
//         method:'post',
//         data:{code},
//         success:(response)=>{
//             if(!response.valid){
//                 validMessage.innerHTML=response.message
//                 couponInvalidMess.classList.remove("couponHide")
//                 setTimeout(() => {
//                     couponInvalidMess.classList.add("couponHide")
//                 }, 5000);
                

//             }else{
//                 console.log(response.redeem);
//                 discount.innerHTML=response.redeem.discount
//                 total.innerHTML = response.redeem.total
//                 discount2.innerHTML=response.redeem.discount
//                 total2.innerHTML = response.redeem.total
//                 MessDis.innerHTML =response.redeem.discount
//                 couponInDiv.classList.add("couponHide")
//                 couponShow.classList.remove("couponHide")
//                 appliedCouponInput.value=response.redeem.code
//                 couponPass.value = response.redeem._id
//             }
//         }
//     })
// }


// function removeCoupon(){

//     const code = document.getElementById("couponInput")
//     const discount = document.getElementById("dicountDisplay")
//     const discount2 = document.getElementById("dicountDisplay2")
//     const total = document.getElementById('totalDisplay')
//     const total2 = document.getElementById('totalDisplay2')
//     const couponShow = document.getElementById("couponShow")


//     const appliedCouponInput = document.getElementById("couponApInput")
//     const couponInDiv = document.getElementById("couponInDiv")
//     const couponPass = document.getElementById("couponPass")
//     couponPass.value=""
//     couponShow.classList.add("couponHide")
//     couponInDiv.classList.remove("couponHide")
//     $.ajax({
//         url:"/checkout/placeorder/amountverify",
//         method:'get',
//         success: (response)=>{
//             total.innerHTML=response
//             total2.innerHTML=response
//             discount.innerHTML=0
//             discount2.innerHTML=0
//             code.value=""
//         }
//     })

// }