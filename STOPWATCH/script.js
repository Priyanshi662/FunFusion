let seconds = 0;
let minutes = 0;
let hours = 0;

let playBtn = document.querySelector("#play");
let pauseBtn = document.querySelector("#pause");
let resetBtn = document.querySelector("#reset");

let hour = document.querySelector("#hour");
let min = document.querySelector("#min");
let sec = document.querySelector("#sec");

let id;

function getTime() {
    seconds++;

    if (seconds % 60 == 0) {
        minutes++;
        seconds = 0;
    }

    if (minutes && minutes % 60 == 0) {
        hours++;
        minutes = 0;
    }

    if (hours && hours % 24 == 0) {
        hours = 0;
        minutes = 0;
        seconds = 0;
    }


    if (hours < 10) {
        hour.innerHTML = `0${hours} :`;
    } else {
        hour.innerHTML = `${hours} :`;
    }

    if (minutes < 10) {
        min.innerHTML = `0${minutes} :`;
    } else {
        min.innerHTML = `${minutes} :`;
    }

    if (seconds < 10) {
        sec.innerHTML = `0${seconds}`;
    } else {
        sec.innerHTML = `${seconds}`;
    }

    console.log(sec.innerHTML);

}



playBtn.addEventListener("click", () => {
    id = setInterval(() => {
        getTime();
    }, 1000);
})

pauseBtn.addEventListener("click", () => {
    clearInterval(id);
})

resetBtn.addEventListener("click" , ()=> {
    seconds = 0;
    hours = 0;
    minutes = 0;
    
    hour.innerHTML = `00 :`;
    min.innerHTML = `00 :`;
    sec.innerHTML = `00`;
})
