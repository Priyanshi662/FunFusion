let btn = document.querySelectorAll(".btn")
let display = document.querySelector("#display")

btn[0].onclick = async() => {
   let response = await fetch(meme);
   let memes = await response.json();
   console.log(memes)
   let imgUrl = memes.preview[2];
   display.innerHTML = `<img src="${imgUrl}" alt="Meme">`;
   ans.count = 0;
};


let meme ="https://meme-api.com/gimme";