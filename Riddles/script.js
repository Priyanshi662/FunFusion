let btn = document.querySelectorAll(".btn")
let display = document.querySelector("#display")
let spn = document.querySelector("span");


btn[0].onclick = async() => {
    let response = await fetch(riddleurl);
    let riddles = await response.json();
    console.log(riddles)
    display.innerHTML = riddles.riddle;
    ans.data = riddles.answer;
    ans.count = 0;
};
let ans = {
    data: "NULL",
    count : 0
};

spn.onclick = () => {
    if (ans.data === "NULL" && ans.count === 0){
        alert('Generate a riddle first')
    }
    else if(ans.data != "NULL"){
        display.innerHTML = display.innerHTML+"<br><br>"+"<p>Answer:</p>"+ans.data;
        ans.count = 1;
        ans.data = "NULL";
    }
    else{
        alert("Answer already revealed")
    }
}
let riddleurl = "https://riddles-api.vercel.app/random";