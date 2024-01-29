const insert = document.getElementById('insert');

const key = document.querySelector(".key");
const keycode = document.querySelector(".keyCode");
const code = document.querySelector(".code");



window.addEventListener('keydown',(e)=>{
    key.innerHTML = `${e.key == " "? "space" : e.key}`;
    keycode.innerHTML = `${e.keyCode}`;
    code.innerHTML = `${e.code}`;
})