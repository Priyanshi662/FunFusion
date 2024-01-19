let userScore = 0;
let compScore = 0;

const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");


const genCompChoice = () =>{
    const options = ["rock","paper","scissors"];
    //rock, paper, scissors
    //Math.random();
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];    
};  

const drawGame = ()=>{
    //console.log("game was draw!!");
    msg.innerText = "Game Draw, play Again!!"
    msg.style.backgroundColor = "#081b31";
};

const showWinner = (userWin,userChoice,compChoice)=>{
    if(userWin){
       // console.log("you win!!");
        msg.innerText  = `You Win! Your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
        userScore++;
        userScorePara.innerText = userScore;
    }
    else{
       // console.log("you lose!!!");
        msg.innerText = `You lost. ${compChoice} beats Your ${userChoice}`;
        msg.style.backgroundColor = "red";
        compScore++;
        compScorePara.innerText = compScore;
    }
};

const playGame = (userChoice)=>{
    console.log("user choice =", userChoice);
    //generate comp choice ->modular;
    const compChoice = genCompChoice();
    console.log(compChoice);

    if(userChoice === compChoice){
        //Draw Game
        drawGame();
    }
    else{
        let userWin = true;
        if(userChoice === "rock"){
            //scissor , paper
            userWin = compChoice ==="paper" ? false : true;
        }
        else if(userChoice==="paper"){
            //rock , scissor
            userWin  = compChoice === "scissors" ? false : true;
        }   
        else{
            //rock, paper
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin,userChoice,compChoice);
    }

};

choices.forEach((choice)=>{
   // console.log(choice);
    choice.addEventListener("click",()=>{
        const userChoice = choice.getAttribute("id");
        console.log("choice was clicked",userChoice);
        playGame(userChoice);
    });
});

