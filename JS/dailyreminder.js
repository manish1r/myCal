const dailyreminder=document.getElementById("dailyreminder");
const dayData=document.getElementById("dayData");
const months=["January","February","Mar","April","May","June","July","Augest","September","october","November","December"];
const tadaydate=new Date();
display(tadaydate);
async function display(d){
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
    // let firstDay=Math.abs(day-(today.getDate()%7))+1;
    let firstDay=new Date(year, month, 1).getDay();
    console.log("fD:",firstDay);
    if(month===1){
        if((year%4==0&&year%100!=0)||(year%400==0)) monthdays=29;
        else monthdays=28;
    }
    else if(month==3||month==5||month==8||month==10) monthdays=30;
    else monthdays=31;
    for(let i=0;i<firstDay;i++){
        calender.innerHTML+=`<button></button>`;
    }
    for(let i=1;i<=monthdays;i++){
        const button=document.createElement("button");
        button.textContent=i;
        button.style.height="80px";
        if(i===today.getDate()) {
            button.classList.add("today");
        }
        dayData.innerHTML+="";
        const normalizeDate=(date)=>new Date(date.getFullYear(),date.getMonth(),date.getDate());
        let upcomingReminders=[];
        const selectedDate=normalizeDate(new Date(year,month,i));
        button.addEventListener("click",async()=>{
            upcomingReminders=[];
            console.log("Date:",i," month:",month," year: ",year);
            const userId=localStorage.getItem("userId");
            const response=await fetch(`http://localhost:3030/dailyreminder/upcoming?userId=${userId}`);
            const result=await response.json();
            console.log("result:",result);
            for(const res of result.reminders){
                const startDate=normalizeDate(new Date(res.date));
                const endDate=normalizeDate(addDuration(res.date,res.duration));
                // console.log("today:",today,"\nsd:",startDate,"\ned:",endDate);
                if(((selectedDate.getTime()===startDate.getTime())||(selectedDate.getTime()===endDate.getTime()))||(selectedDate>=startDate&&selectedDate<=endDate)){
                    upcomingReminders.push(res);
                    // tim+=res.time.substring(0,5);
                    // dur+=res.duration;
                }
            }
            console.log("Upcoming Reminders : ",upcomingReminders);
            console.log("Outside Upcoming Reminders : ",upcomingReminders," length:",upcomingReminders.length);
            dayData.innerHTML=`
            <h3>${selectedDate.toDateString()}</h3>
            `;
            if(upcomingReminders.length!==0){
                for(const x of upcomingReminders){
                    const sd=normalizeDate(new Date(x.date));
                    dayData.innerHTML+=`
                        <div style="text-align:left;display:flex;flex-direction:column;height:auto;margin-bottom:10px;padding:20px 10px;width:auto">
                            <strong>Discription:</strong>${x.discription}<br>
                            <strong>Time:</strong>${x.time}<br>
                            <strong>Duration:</strong>${x.duration}<br>
                            <strong>Start Date:</strong>${sd.toDateString()}<br>
                        </div>
                    `;
                }
            }else dayData.innerHTML+=`<p>No Reminders</p>`;
        });
        calender.appendChild(button);
    }
}

console.log("Hello add task : ",dailyreminder);
dailyreminder.innerHTML+=`
    <h2>Set Your Daily Reminder</h2>
    <form action="" style="width: 70vh;
        height: auto;
        background-color:white;
        text-align:left;">
        <div style="margin: 5%;display:flex;">
            <label for="discription">Discription : </label>
            <textarea id="discription" name="task" rows="3" cols="30" placeholder="Type your task here..."></textarea><br>
        </div>
        <div style="margin: 5%;display:flex;">
            <label for="reminderTime">Reminder Time : </label>
            <input type="time" id="reminderTime"><br>
        </div>
        <div style="margin: 5%;display:flex;">
            <label for="startDate">Start Date : </label>
            <input type="date" id="startDate"><br>
        </div>
        <div style="margin: 5%;">
            <label for="duration">Duration   : </label>
            <select name="duration" id="duration">
                <option value="2days">2 Days</option>
                <option value="3days">3 Days</option>
                <option value="4days">4 Days</option>
                <option value="5days">5 Days</option>
                <option value="6days">6 Days</option>
                <option value="1week">1 Week</option>
                <option value="2week">2 Week</option>
                <option value="3week">3 Week</option>
                <option value="1month">1 month</option>
                <option value="1year">1 Year</option>
            </select>
        </div>
        <div id="message"></div>
        <div style="margin: 5%;">
            <button id="add_button" type="button" style="height:45px;width:100px;background-color:white;font-size:18px;border-radius:9px">Add</button>
        </div>
    </form>
`;
const addButton=document.getElementById("add_button");
const message=document.getElementById("message");
addButton.addEventListener("click",async()=>{
    console.log("Add button clicked");
    const discription=document.getElementById("discription").value.trim();
    const time=document.getElementById("reminderTime").value.trim();
    const duration=document.getElementById("duration").value.trim();
    const date=document.getElementById("startDate").value.trim();
    message.innerHTML+="";
    console.log("Duration:",duration,"\nDis:",discription,"\ntime:",time,"\nDate: ",date);
    if(!duration||!discription||!time||!date){
        addMessage("Fill all the details","Red");
        return;
    }
    const userId=localStorage.getItem("userId");
    try{
        const response=await fetch("http://localhost:3030/dailyreminder",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({userId,discription,time,duration,date}),
        });
        const result=await response.json();
        if(result.success){
            addMessage("Reminder Added Sucessfully","green");
        }
        else{
            addMessage("Failed to add Task","red");
        }
    }
    catch(err){
        console.log("Error : ",err);
        addMessage("Server Error","red");
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
    inputdate.style.display = "none";
})

function addDuration(date,duration){
    const d=new Date(date);
    if(duration==="2days") d.setDate(d.getDate()+1);
    else if(duration==="3days") d.setDate(d.getDate()+2);
    else if(duration==="4days") d.setDate(d.getDate()+3);
    else if(duration==="5days") d.setDate(d.getDate()+4);
    else if(duration==="6days") d.setDate(d.getDate()+5);
    else if(duration==="1week") d.setDate(d.getDate()+6);
    else if(duration==="2week") d.setDate(d.getDate()+13);
    else if(duration==="3week") d.setDate(d.getDate()+20);
    else if(duration==="1month") d.setMonth(d.getMonth()+1);
    else if(duration==="1year") d.setFullYear(d.getFullYear()+1);
    return d;
}