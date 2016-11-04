/**
 * Created by apple on 10/30/2016 AD.
 */
var count;
var t;
var timeinterval

function getTimeRemaining(endtime) {

    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds
    };
}


function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');


    function updateClock() {
        t = getTimeRemaining(endtime);

        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);
            window.alert("time's up");
        }
    }

    updateClock();
    timeinterval = setInterval(updateClock, 1000);
}
function countertime() {
    count++;
}
function starttime() {
    var timeInMinutes = 1;
    var currentTime = Date.parse(new Date());
    var deadline = new Date(currentTime + timeInMinutes*60*1000);
    initializeClock('clockdiv', deadline);
    //document.getElementById("p").isDisabled = true;
    count = 0;
    myVar = setInterval(countertime, 1000);
}

function stoptime() {
    clearInterval(timeinterval)
    clearInterval(myVar);
    return count;
}