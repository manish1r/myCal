// const today = new Date();
// // console.log("Date : ",today.);
// console.log("Today : ",today);
// console.log("Today day: ",today.getDay());
// console.log("Today Month: ",today.getMonth());
// const year = today.getFullYear();
// const month = today.getMonth();
// const firstDay = new Date(year, month, 1).getDay();
// const daysInMonth = new Date(year, month + 1, 0).getDate();
// const calendarDates = document.getElementById('calendarDates');
// console.log("First day: ",firstDay);
// console.log("Days in month : ",daysInMonth);
// console.log("Calender days : ",calendarDates);
// for (let i = 0; i < firstDay; i++) {
//     calendarDates.innerHTML += `<div></div>`;
// }
// for (let d = 1; d <= daysInMonth; d++) {
//     const isToday = (year === today.getFullYear() && month === today.getMonth() && d === today.getDate());
//     calendarDates.innerHTML += `<div class="${isToday ? 'today' : ''}">${d}</div>`;
// }
const months=["January","February","Mar","April","May","June","July","Augest","September","october","November","December"];
const tadaydate=new Date();
display(tadaydate);
function display(d){
    const today=new Date(d);
    const month=today.getMonth();
    const year=today.getFullYear();
    const day=today.getDay();
    console.log("Month:",month,"\nYear:",year,"\nDay:",day);
    const calender=document.getElementById("calendarDates");
    calender.innerHTML="";
    const monthandyear1=document.getElementById("monthandyear");
    monthandyear1.innerHTML=`${months[month]} ${year}`;
    let monthdays=0;
    let firstDay=day-(today.getDate()%7)+1;
    if(month===1){
        if((year%4==0&&year%100!=0)||(year%400==0)) monthdays=29;
        else monthdays=28;
    }
    else if(month==3||month==5||month==8||month==10) monthdays=30;
    else monthdays=31;
    for(let i=0;i<firstDay;i++){
        calender.innerHTML+=`<div></div>`;
    }
    for(let i=1;i<=monthdays;i++){
        if(i==today.getDate()) calender.innerHTML+=`<div class="today">${i}</div>`;
        else calender.innerHTML+=`<div>${i}</div>`;
    }
}

const addtask=document.getElementById("addtask");
const dailyreminder=document.getElementById("dailyreminder");
console.log("Hello add task : ",addtask);
console.log("Hello daily reminder : ",dailyreminder);
addtask.addEventListener("click",()=>{
   setTimeout(() => {window.location.href = "task.html";}, 1000); 
});
dailyreminder.addEventListener("click",()=>{
   setTimeout(() => {window.location.href = "dailyreminder.html";}, 1000); 
});
const inputdate=document.getElementById("inputdate");
const gotodate=document.getElementById("gotoButton");
gotodate.addEventListener("click",()=>{
    console.log("Goto Clicked");
    inputdate.style.display="inline-block";
    inputdate.focus(); 
});
inputdate.addEventListener("change",()=>{
    const selectedDate=new Date(inputdate.value);
    console.log("Selected date : ",selectedDate,"\nDate:",selectedDate.getDate());
    display(selectedDate);
})  