// to generate random number we will use math.random
const randomnumber= parseInt(Math.random()*100+1);
const submit =document.querySelector('#subt')
const userInput=document.querySelector('#guessField')
const guessSlot=document.querySelector('.guesses')
const remaining= document.querySelector('.lastResult');
const loworhi= document.querySelector('.lowOrHi')
const startover = document.querySelector('.resultparas');

const p= document.createElement('p');
let prevguess=[];
let numguess= 1;
let playgame=true;
if(playgame){
    submit.addEventListener('click', function(e){
        e.preventDefault()
       const guess= parseInt(userInput.value);
       validateguess(guess);
    })

}
function validateguess(guess){
// value validate ki 1-100 k beech hi h na
if(isNaN(guess)){
    alert('Please enter a valid number')
} else if(guess<1){
    alert('Please enter a  number more than 1')

}
else if(guess>100){
    alert('please enter number more than 100');
}
else{
    prevguess.push(guess)
    if(numguess===11){
        displayguess(guess)
        displayMessage(`Game over. Random number was ${randomnumber}`);
        endGame()
    }
    else{
        displayguess(guess)
        checkguess(guess)
    }
}

}
 function checkguess(guess){
    // value check hoegi
    if(guess===randomnumber){
        displayMessage(`You guessed it right`)
        endGame()
    }else if(guess<randomnumber){
        displayMessage(`Number is too low`)
    }
    else if(guess>randomnumber){
        displayMessage(`number is too high`)
    }
 }
 function displayguess(guess){
    // values clean krega , guesses update krega
    userInput.value=''
    guessSlot.innerHTML+=`${guess}  `
    numguess++;
    remaining.innerHTML=`${10-numguess}`

 }
 function displayMessage(message){
    loworhi.innerHTML=`<h2>${message}</h2>`;


 }

 function newGame(){
   const newGame =document.querySelector('#newGame')
newGame.addEventListener('click', function(e)
{
    randomnumber= parseInt(Math.random()*100+1);
    prevguess=[]
    numguess=1
    guessSlot.innerHTML=''
    remaining.innerHTML=`${10-numguess}`;
    userInput.removeAttribute('disabled')
    startover.removeChild(p)


    playgame=true

})
 }
 function endGame(){
    userInput.value=''// value clean ho gai
    userInput.setAttribute('disabled', '')
    p.classList.add('button')
    p.innerHTML=`<h2 id ="newGame"> Start New game</h2>`
    startover.appendChild(p)
    playgame=false;
    newGame()



 }