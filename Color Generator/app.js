let btn=document.querySelector("button");
btn.addEventListener("click",function(){
    let h3=document.querySelector("h3");
    let rdmclr=generateColor();
    let div=document.querySelector("div");
    h3.innerText=rdmclr;
    div.style.backgroundColor=rdmclr;
});
function generateColor(){
    let red=Math.floor(Math.random()*255);
    let green=Math.floor(Math.random()*255);
    let blue=Math.floor(Math.random()*255);
    let color=`rgb(${red},${green},${blue})`;
    return color;
}
