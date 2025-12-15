const addtask=document.getElementById("addtask");
const dailyreminder=document.getElementById("dailyreminder");
const calender=document.getElementById("calender");
console.log("Hello add task : ",addtask);
console.log("Hello daily reminder : ",dailyreminder);
addtask.addEventListener("click",()=>{
   setTimeout(() => {window.location.href = "task.html";}, 1000); 
});
dailyreminder.addEventListener("click",()=>{
   setTimeout(() => {window.location.href = "dailyreminder.html";}, 1000); 
});
calender.addEventListener("click",()=>{
   setTimeout(() => {window.location.href = "calender.html";}, 1000); 
});