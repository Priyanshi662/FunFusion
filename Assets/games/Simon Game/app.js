let sequence = [];
let user = [];
let h2 = document.querySelector("h2");
let div = document.querySelector(".play");
let score=document.querySelector("p");
let level=0;
let high =0;
div.addEventListener("click", function (event) {
    if (sequence.length == 0&&level==0) {
        let a = Math.floor(Math.random() * 4 + 1);
        console.log(a);
        sequence.push(a);
        let temp = document.getElementById(`${a}`);
        let color = temp.style.backgroundColor;
        temp.style.backgroundColor = "white";
        h2.innerText = "Level : 1";
        level++;
        setTimeout(function () {
            temp.style.backgroundColor = color;
        }, 200);
    }
    else if(sequence.length!=0){
        let idx=user.length;
        user.push(Number(event.target.id));
        let temp = event.target;
        let color = temp.style.backgroundColor;
        temp.style.backgroundColor = "white";
        setTimeout(function () {
            temp.style.backgroundColor = color;
        }, 200);
        if(user[idx]!=sequence[idx]){
            h2.innerHTML = `GAME OVER !! Your Score : ${level}<br> To restart click any color`; 
            high=Math.max(high,level);
            score.innerText=`HIGHEST SCORE : ${high} `;
            let body=document.querySelector(".container");
            body.style.backgroundColor="red";
            setTimeout(function () {
                body.style.backgroundColor = "white";
            }, 200);
            sequence=[];
            user=[];
            level=0;
        }
        else if(user.length==sequence.length){
            level++;
            h2.innerText = `Level : ${level}`;
            user=[];
            setTimeout(function (){
                levelup();
            },1000);
            
        }
    }

});

function levelup(){
                let a = Math.floor(Math.random() * 4 + 1);
                sequence.push(a); 
                let temp = document.getElementById(`${a}`);
            let color = temp.style.backgroundColor;
            temp.style.backgroundColor = "white";
            setTimeout(function () {
                temp.style.backgroundColor = color;
            }, 200);
}