const addtask=document.getElementById("adding");
const dayData=document.getElementById("dayData");
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
    // let firstDay=day-(today.getDate()%7)+1;
    let firstDay=new Date(year, month, 1).getDay();
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
        let upcomingTasks=[];
        const button=document.createElement("button");
        button.textContent=i;
        button.style.height="80px";
        if(i===today.getDate()) {
            button.classList.add("today");
        }
        dayData.innerHTML+="";
        const selectedDate=(new Date(year,month,i));
        button.addEventListener("click",async()=>{
            upcomingTasks=[];
            console.log("Date:",i," month:",month," year: ",year);
            const userId=localStorage.getItem("userId");
            const response=await fetch(`https://mycal-jgvb.onrender.com/task/upcoming?userId=${userId}`);
            const result=await response.json();
            for(const res of result.tasks){
                const resDate=(res.date[8])+(res.date[9]);
                if(resDate==i){
                    upcomingTasks.push(res);
                }
            }
            console.log("Upcoming Tasks : ",upcomingTasks);
            dayData.innerHTML=`
            <h3>${selectedDate.toDateString()}</h3>
            `;
            if(upcomingTasks.length!==0){
                for(const x of upcomingTasks){
                    dayData.innerHTML+=`
                        <div style="text-align:left;display:flex;flex-direction:column;height:auto;margin-bottom:10px;padding:20px 10px;width:auto">
                            <strong>Discription:</strong>${x.discription}<br>
                            <strong>Time:</strong>${x.time}<br>
                        </div>
                    `;
                }
            }else dayData.innerHTML+=`<p>No Tasks</p>`;
        });
        calender.appendChild(button);
    }
}

console.log("Hello add task : ",addtask);
addtask.innerHTML+=`
    <h2>Add Your Task</h2>
    <form action="" style="width: 70vh;
        height: auto;
        background-color:white;
        text-align:left;">
        <div style="margin: 5%;">
            <label for="date">Date  : </label>
            <input type="date" id="date"><br>
        </div>
        <div style="margin: 5%;display:flex;">
            <label for="discription">Discription : </label>
            <textarea id="discription" name="task" rows="3" cols="30" placeholder="Type your task here..."></textarea><br>
        </div>
        <div style="margin: 5%;display:flex;">
            <label for="reminderTime">Reminder Time : </label>
            <input type="time" id="reminderTime"><br>
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
    const date=document.getElementById("date").value.trim();
    const discription=document.getElementById("discription").value.trim();
    const time=document.getElementById("reminderTime").value.trim();
    message.innerHTML+="";
    console.log("Date:",date,"\nDis:",discription,"\ntime:",time);
    if(!date||!discription||!time){
        addMessage("Fill all the details","Red");
        return;
    }
    const userId=localStorage.getItem("userId");
    try{
        const response=await fetch("https://mycal-jgvb.onrender.com/task",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({userId,date,discription,time}),
        });
        const result=await response.json();
        if(result.success){
            addMessage("TaskAdded Sucessfully","green");
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

// fetchUpcomingTasks();
// async function fetchUpcomingTasks() {
//     try {
//         const response = await fetch("http://localhost:3030/task/upcoming");
//         const result = await response.json();
//         if (result.success) {
//             console.log("Upcoming tasks:", result.tasks);
//         }
//         return result;
//     } catch (err) {
//         console.log("Error fetching Tasks:", err);
//     }
// }
