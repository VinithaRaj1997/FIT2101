var dateValue;
var randdate=new Date(2018-04-05);
var endDate =JSON.parse(localStorage.getItem(dateValue)) ||randdate ; // This is the global variable for the day of the deadline
console.log(endDate);
console.log(randdate);

/* ------------------ Utility functions -------------------*/
function chgStudent(stID) {
	/* Function sets the sessionStorage variable to the new student's ID and reloads the page.
	On page load, the new student's data is retrieved. */
    
	sessionStorage.setItem("stID", stID);
	location.reload();
}

function showStudents() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function deadline(enddate) {
    /* This is the function required to calculate the days remaining till the deadline. */
    
    var t = Date.parse(enddate) - Date.parse(new Date()); // deadline - current time
    console.log(t);
    var seconds = Math.floor( (t/1000) % 60 ); // getting second left
    var minutes = Math.floor( (t/1000/60) % 60 ); // getting minutes left
    var hours = Math.floor( (t/(1000*60*60)) % 24 ); // getting hours left
    var days = Math.floor( t/(1000*60*60*24) ); // getting days left
    return {
        "total": t, // The time remaining in milisecond format
        "days": days, // Days remaining
        "hours": hours, // Hours remaining
        "minutes": minutes, // Minutes remaining
        "seconds": seconds // Second remaining
    };
}

/* ----------------- index.html ---------------------------------- */
function getData(stID) {
	/* Function takes student's input from the textbox and saves it to localStorage.
	This function is called upon the submit button being pressed. */
	
	var storage = "data" + stID; 
    var check = "check" + stID;
    var data = document.getElementById("myTextBox").value;
	var x = document.getElementById(check).checked;
    if (x)
    {
         localStorage.setItem(check, 1);
    }
    else
    {
        localStorage.setItem(check, 0);
    }
	
    localStorage.setItem(storage, data);
	sessionStorage.setItem("stID", stID);
    location.href = "submission.html";
}

function initializeClock(stID){
    var status;
	var demEnable = "demEnableButton" + stID;
	var buttonID = "button" + stID;
    status = localStorage.getItem(demEnable);
    //console.log("status");
    //console.log(status);
    if (status)
    {
        endDate=new Date(endDate);
        console.log(endDate);
        /*var newdate=new Date(endDate);
        console.log(newdate);
        var dd = newdate.getDate();
        var yy=newdate.getFullYear();
        var mm=newdate.getMonth();
        newdate=yy+'/'+mm+'/'+dd;
        endDate=new Date(newdate);//postpone the date by 2 hours
        console.log(endDate);*/
    }
    document.getElementById("deadline").innerHTML = "Deadline: " + endDate;
    console.log(endDate);
    console.log(Date(endDate));
     var timeinterval = setInterval(function(){
     var t = deadline(endDate);
     document.getElementById("clockdiv").innerHTML = t.days + " Days " + t.hours + " Hours " + t.minutes + " Minutes " + t.seconds + " Seconds remaining";
     
     if(t.total <= 0 && localStorage.getItem("demEnableButton"+stID) != 1)
     {
         localStorage.setItem(demEnable, 0);
         clearInterval(timeinterval);
         document.getElementById(buttonID).disabled = true;
     }
     },1000);
}

function notification()
{
    var t = deadline(endDate);
	alert("You have " + t.days + " Days " + t.hours + " Hours " + t.minutes + " Minutes " + t.seconds + " Seconds left");
}

function checkSubmitted(stID) {
	/* Function checks whether student has submitted the assignment before.
	If so, textbox will be disabled unless student presses the edit button.
	If not, textbox will be enabled and the edit button hidden. */
	var dataID = "data" + stID;
	
	if (localStorage.getItem(dataID) !== null) {
		document.getElementById("myTextBox").setAttribute("disabled", "disabled");
		document.getElementById("editButton").removeAttribute("hidden");
		document.getElementById("myTextBox").value = localStorage.getItem(dataID);
	}
}

function enableEdit() {
	/* Function enables textbox for editing when the edit button is pressed,
	and the student can edit their assignment and resubmit it. */
	
	document.getElementById("myTextBox").removeAttribute("disabled");
}

function checkBox(stID)
{
	var checkID;
    if (localStorage.getItem("check1"))
    {
        document.getElementById("check1").checked = true;
    }
    
    if (localStorage.getItem("check2"))
    {
        document.getElementById("check2").checked = true;
    }
    
    if (localStorage.getItem("check3"))
    {
        document.getElementById("check3").checked = true;
    }
    
    if (localStorage.getItem("check4"))
    {
        document.getElementById("check4").checked = true;
    }
	
	for (var i = 1; i <= 4; i++) {
		checkID = "check" + i;
		if (i != stID) {
			document.getElementById(checkID).disabled = true;
		}
	}
}

function getDataOutput(stID) {
    var data = "data" + stID;
    localStorage.setItem(data, document.getElementById("myTextBox").value);
    location.href = "mark1.html";
}

/* -------------------- submission.html -------------------------*/
function getMark(stID) {
    var mark_1, mark_2, mark_3, mark_4, mark_5, mark_6, total, markobj;
	var markID = "myMarks" + stID;
    mark_1 = document.getElementById("mark1").value;
    mark_2 = document.getElementById("mark2").value;
    mark_3 = document.getElementById("mark3").value;
    mark_4 = document.getElementById("mark4").value;
    mark_5 = document.getElementById("mark5").value;
    mark_6 = document.getElementById("mark6").value;
    total = Number(mark_1) + Number(mark_2) + Number(mark_3) + Number(mark_4) + Number(mark_5) + Number(mark_6);
	if (isNaN(total)) {
		alert("Invalid input");
	} else {
		document.getElementById("outputMark").innerHTML = total;
		markobj = {	mark1: mark_1,
					mark2: mark_2,
					mark3: mark_3,
					mark4: mark_4,
					mark5: mark_5,
					mark6: mark_6,
					total: total
		};
		localStorage.setItem(markID, JSON.stringify(markobj));
	}
}
 
function demEnableButton(stID) //demonstrator enable edit button for student
{
    /* Demonstrator click enable button, save the variable to local storage */
    localStorage.setItem("demEnableButton"+stID, 1);
}

function demDisableButton(stID)
{
    /* Demonstrator click disable button, save the variable to local storage */
    localStorage.setItem("demEnableButton"+stID, 0);
}

function setDate(){
    
    var setdate=document.getElementById("mydate").value
    localStorage.setItem(dateValue,JSON.stringify(setdate))
    
}
function genPDF(stID) {
	var doc = new jsPDF();
	var stData = localStorage.getItem("data"+stID);
	stData = "Student " + stID + "\n\n" + stData;
	
	doc.text(20, 20, stData);
	doc.save("Student "+stID);
}

/* ---------------- mark.html ------------------------------*/
function printData(stID) {
	var dataID = "data" + stID;
	var markID = "myMarks" + stID;
	var markObj;
	if (localStorage.getItem(markID) !== null) {
		markObj = JSON.parse(localStorage.getItem(markID));
		document.getElementById("myMarkOutput").innerHTML = markObj.total;
	}
	document.getElementById("output").innerHTML = localStorage.getItem(dataID);
}