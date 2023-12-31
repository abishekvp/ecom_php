function auth(fuc){
    if(window.localStorage.getItem("signin")){
        if(fuc){window[fuc]();}
    }else{
        window.location.href = "./index.html";
    }
}

function signup(){
    var name = document.getElementById("su-name").value;
    var contact = document.getElementById("su-contact").value;
    var email = document.getElementById("su-email").value;
    var password = document.getElementById("su-password").value;
    var re_password = document.getElementById("su-re_password").value;

    if(name!="" && contact!="" && email!="" && password===re_password){
        $.ajax({
            type: 'POST',  
            url: './php/main.php', 
            data: { fuc:"signup", name:name, contact:contact, email:email, password:password },
            success: function(response) {
                if(response=="registered"){
                    window.localStorage.setItem("signin", true);
                    window.localStorage.setItem("email", email);
                    window.location.href="./profile.html";
                }
                else if(response=="exists") {
                    alert("User exists!");
                }
            }
        });
    }else{
        alert("Provide required details");
    }
}

function signin(){
    var email = document.getElementById("si-email").value;
    var password = document.getElementById("si-password").value;
    
    if(email!="" && password!=""){
        $.ajax({
            type: 'POST',  
            url: './php/main.php',
            data: { fuc:"signin", email:email, password:password },
            success: function(response) {
                if(response=="found"){
                    window.localStorage.setItem("signin", true);
                    window.localStorage.setItem("email", email);
                    window.location.href="./dashboard.html";
                }
                else if(response=="notfound") {
                    alert("user not found");
                    window.localStorage.setItem("signin", false);
                }
            }
        });
    }else{
        alert("Provide required details");
    }
}

function signout(){
    window.localStorage.clear();
    window.location.href="./index.html";
}

function fetch_profile(){
    if(window.localStorage.getItem("signin")){
        $.ajax({
            type: 'POST',  
            url: './php/main.php',
            data: { fuc:"profile", email:window.localStorage.getItem("email") },
            success: function(response) {
                data=response.split("&");
                document.getElementById("name").value=data[0];
                document.getElementById("contact").value=data[1];
                document.getElementById("email").value=data[2];
                document.getElementById("password").value=data[3];
            }
        });
    }else{
        window.location.href = "./index.html";
    }
}

function update(){
    var name = document.getElementById("name").value;
    var contact = document.getElementById("contact").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    if(name!="" && contact!="" && email!="" && password!=""){
        $.ajax({
            type: 'POST',  
            url: './php/main.php', 
            data: { fuc:"update", name:name, contact:contact, email:window.localStorage.getItem("email"), email_c:email, password:password },
            success: function(response) {
                if(response==="updated"){
                    alert("Profile Update");
                    window.localStorage.setItem("signin", true);
                    window.localStorage.setItem("email", email);
                    window.location.href="./profile.html";
                }
                else{
                    alert(response);
                }
            }
        });
    }else{
        alert("Provide required details")
    }
}

function products(){
    if(window.localStorage.getItem("signin")){
        $.ajax({
            type: 'POST',  
            url: './php/main.php',
            data: { fuc:"products" },
            success: function(response) {
                response.forEach(product => {
                    $('#products_list').append(`
                    <img src="${product.p_image}" alt="" id="p_image"><br>
                    <span>${product.p_name}</span><br>
                    <span>Rs: ${product.rate}/.</span><br>
                    <span>Quantity: ${product.qty}</span><br>
                    `);
                });
            }
        });
    }else{
        window.location.href = "./index.html";
    }
}

function add_product(){
    var p_image = document.getElementById('p_image');
    imagetostr(p_image.files[0]);
    p_image = window.localStorage.getItem("p_image");
    var p_name = $('#p_name').val();
    var descr = $('#descr').val();
    var rate = $('#rate').val();
    var qty = $('#qty').val();
    var stock = $("input[type='radio'][name='stock']:checked").val();
    var _id = (new Date().toLocaleString('en-US', {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',timeZoneName:'short'})).replace(/\D/g, '');
    $.ajax({
        type: 'POST',  
        url: './php/main.php', 
        data: { fuc:"add_product", p_image:p_image, p_name:p_name, descr:descr, rate:rate, qty:qty, stock:stock, _id:_id },
        success: function(response) {
            console.log(response);
        }
    });
}

function imagetostr(file){
    var canvas = document.getElementById('canvas');
    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, img.width, img.height);
                var imgstr = canvas.toDataURL('image/png');
                window.localStorage.setItem("p_image", imgstr);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        alert('Select image');
    }
}

