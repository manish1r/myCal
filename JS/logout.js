window.addEventListener("DOMContentLoaded",()=>{
    localStorage.removeItem("userId");
    alert("You have been Sucessfully Logged out");
    setTimeout(()=>{window.location="Home.html"},1000);
});