function startTimer(minute) {
	var count = 1;
	var interval = 60 * minute,
		display = document.getElementById("time"),
		mins, seconds;
	setInterval(function() {
		mins = parseInt(interval / 60)
		seconds = parseInt(interval % 60);
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.innerHTML = mins + ":" + seconds;
		interval--;

		if (interval <= 0 && count==1) {
			display.innerHTML = "00:00";
			timeout();
			count=count+1;
		}
	}, 1000);
}

function timeout(){
	alert("Your login session is expired. Please sign in again.");
    parent.location.href='../bankinglogout.html' ;
}    

function stopRKey(evt) { 
	var evt = (evt) ? evt : ((event) ? event : null); 
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
	if ((evt.keyCode == 13) && (node.type=="text"))  {return false;} 
} 

document.onkeypress = stopRKey; 