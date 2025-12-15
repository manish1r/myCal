let button=document.getElementById("login_button");
let message=document.querySelector(".message");
button.addEventListener("click",async()=>{
    let user=document.getElementById("username").value.trim();
    let password=document.getElementById("password").value.trim();
    message.innerHTML="";
    console.log("User : ",user);
    console.log("Password : ",password);
    if(user===""||password===""){
        let cdiv=document.createElement("div");
        addMessage("Fill all the details","red");
        return;
    }
    let found=false;
    try{
        const response=await fetch("http://localhost:3030/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:user,password:password})
        });
        const data=await response.json();
        if(data.status){
            localStorage.setItem("userId",data.userId);
            addMessage("Login Sucessful","green");
            found=true;
            setTimeout(()=>{window.location.href="user_home.html";},1000);
            return;
        }
    }
    catch(err){
        console.log("Login error : ",err);
        return;
    }
    if(!found){
        addMessage("Invalid Details","red");
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