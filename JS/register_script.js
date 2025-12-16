let button=document.getElementById("register_button");
let message=document.querySelector(".message");
button.addEventListener("click",async()=>{
    let user=document.getElementById("username").value.trim();
    let password=document.getElementById("password").value.trim();
    let conform_password=document.getElementById("conform_password").value.trim();
    let email=document.getElementById("email").value.trim();
    let mobileNumber=document.getElementById("mobileNumber").value.trim();
    message.innerHTML="";   
    console.log("User : ",user);
    console.log("Password : ",password);
    if(user===""||password===""||conform_password===""||email===""||mobileNumber===""){
        addMessage("Fill all the details","red");
        return;
    }
    else if(password!==conform_password){
        addMessage("Passwords Didn't Match","red");
        return;
    }
    else if(mobileNumber.length!=10){
        addMessage("Mobile number must have 10 digits only","red");
        return;
    }
    let found=false;
    let users=[];
    let emails=[];
    try{
        const response=await fetch("https://mycal-jgvb.onrender.com/users");
        const data=await response.json();
        users=data.map(user=>user.username);
        emails=data.map(user=>user.email);
        console.log("Users : ",users);
        console.log("Emails : ",emails);
    }
    catch(err){
        console.log("Error while fetcinh in register : ",err);
    }
    for(let i=0;i<users.length;i++){
        if(user===users[i]){
            addMessage("Username already exists","red");
            found=true;
            break;
        }
    }
    for(let i=0;i<emails.length;i++){
        if(email===emails[i]){
            addMessage("Email already exists","red");
            found=true;
            break;
        }
    }
    if(!found){
        try {
            const res = await fetch("https://mycal-jgvb.onrender.com/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username:user,password,email,mobileNumber}),
            });
            const data = await res.json();
            if (data.success) {
                addMessage("Registration successful", "green");
                localStorage.setItem("userId",data.user._id);
                console.log("userId RS : ",localStorage.getItem("userId"));
                setTimeout(() => {window.location.href = "user_home.html";}, 1000);
            } else {
                addMessage(data.message,"red");
            }
        } catch (err) {
            console.log("Error while registering:", err);
            addMessage("Something went wrong","red");
        }
    }

});
function addMessage(s,c){
    message.innerHTML="";
    let cdiv=document.createElement("div");
        cdiv.textContent=s;
        cdiv.style.color=c;
        cdiv.style.margin="3%";
        cdiv.style.fontSize="22px";
        message.appendChild(cdiv);
}
