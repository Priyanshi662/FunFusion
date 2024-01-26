const wordList = [
    {
        word:"search",
        hint: "Theact of finding something"
    },
    {
        word:"jpeg",
        hint:"A small format of an image"
    },
    {
        word:"idea",
        hint:"A thought or suggestion"
    },
    {
        word:"boolean",
        hint:"A data type that represents either of two values: true or false."
    },
    {
        word:"puzzle",
        hint:"A game or problem that tests ingenuity or knowledge"
    },
    {
        word:"rain",
        hint:"Water falling from the sky in drops"
    },
    {
        word:"pizza",
        hint:" A popular Italian dish consisting of a flat, round base of dough topped with tomato sauce and cheese."
    },
    {
        word:"smile",
        hint:"A facial expression indicating happiness or amusement"
    },
    {
        word:"happy",
        hint:" Feeling or expressing joy and contentment"
    },
    {
        word:"ball",
        hint:"A round object used in various sports and games"
    },
    {
        word:"biology",
        hint:"The science of life and living organisms "
    },
    {
        word:"book",
        hint:"A collection of pages bound together, containing written or printed material"
    },
    {
        word:"sun",
        hint:"The star at the center of our solar system"
    },
    {
        word:"blue",
        hint:"Third color of rainbow"
    },
    {
        word:"friend",
        hint: "A person whom one knows and has a bond of mutual affection with."
    },
    {
        word:"raincoat",
        hint:" A waterproof coat worn to protect against rain"
    },
   
    {
        word:"ocean",
        hint:" A large body of saltwater that covers much of the Earth's surface"
    },
    {
        word:"toy",
        hint:" An object for children to play with"
    },
    {
        word:"car",
        hint:"A four-wheeled motor vehicle used for transportation"
    },
    {
        word:"clock",
        hint:"A device for measuring and indicating time"
    },
    {
        word:"robot",
        hint:" A machine capable of carrying out tasks autonomously or with remote control."
    },
    {
        word:"school",
        hint:" An institution where students are educated"
    },
    {
        word:"beach",
        hint:"The shore of a body of water, typically covered with sand or pebbles"
    },
    {
        word:"candy",
        hint:"A sweet food typically made with sugar and flavorings"
    },
    {
        word:"sunny",
        hint:" Describing weather with clear skies and abundant sunlight"
    },
    {
        word:"island",
        hint:"A landmass surrounded by water and smaller than a continent"
    },
    {
        word:"pencil",
        hint:"A writing instrument with a thin cylindrical graphite core encased in wood"
    },
    {
        word:"shoe",
        hint:"Footwear designed to protect and comfort the foot"
    },
    {
        word:"butterfly",
        hint:"An insect with brightly colored wings and a slender body"
    },
    {
        word:"cupcake",
        hint:"A small cake designed to serve one person, often with frosting on top"
    },
    {
        word:"winter",
        hint:" The coldest season of the year, characterized by low temperatures and often snow"
    },
    {
        word:"telescope",
        hint:"An optical instrument used to observe distant objects"
    },
    {
        word:"guitar",
        hint:"A musical instrument with strings, typically played by strumming or plucking."
    },
    {
        word:"moonlight",
        hint:"The light from the moon."
    },
    {
        word:"fire",
        hint:"The phenomenon of combustion producing light, heat, and often smoke."
    },
    {
        word:"whale",
        hint:"A large marine mammal, typically with a streamlined body and a blowhole for breathing."
    },
    {
        word:"astronaut",
        hint:"A person trained for traveling in space"
    },
    {
        word:"popcorn",
        hint:"Popped kernels of corn, often enjoyed as a snack."
    },
    {
        word:"robotics",
        hint:" The branch of technology that deals with the design, construction, and operation of robots"
    },
    {
        word:"bugs",
        hint:"Issues related to programming"
    },
    {
        word:"html",
        hint:"markup language for web development"
    },
    {
        word: "proxy",
        hint:"related to server application"
    },
    {
        word:"rocket",
        hint:"Aspace vehicle"
    },
   { 
       word:"java",
       hint:"A programming language"

    },
    {
        word:"google",
        hint:"Famous Search Engine"
    },
    {
        word:"cat",
        hint: "A common domesticated animal known for its meow sound",
    },
    {
        word:"train",
        hint:"It's a mode of transportation on tracks that can take you from one place to another"
    },
    {
        word:"library",
        hint:"A place where you can borrow books and other materials for reading"
    },
    {
        word:"chair",
        hint:"A piece of furniture used for sitting that often has a back and armrests"
    },
    {
        word:"coffee",
        hint:"A beverage that many people enjoy in the morning, often hot and accompanied by cream and sugar"
    },
    {
        word:"gold",
        hint:" A shiny, yellow metal often used to make coins and jewelry"
    },
    {
        word:"airplane",
        hint:"A vehicle with wings that can fly through the air."
    },

    ]
    const inputs= document.querySelector(".inputs"),
    resetbtn= document.querySelector(".reset-Btn"),
    wrongLetter= document.querySelector(".wrong-letters"),
    hint=document.querySelector(".hint span"),
    guessLeft=document.querySelector(".guess-left span" ),

    typingInput=document.querySelector(".typing-input");

    let word,maxGuesses,incorrects=[], corrects=[];


    function randomWord(){
        let randomObj = wordList[Math.floor(Math.random() * wordList.length)];
         word= randomObj.word;
         maxGuesses=8;incorrects=[]; corrects=[];
        console.log(word);
       
        hint.innerText=randomObj.hint;
        guessLeft.innerText=maxGuesses;
        wrongLetter.innerText=incorrects;

        let html="";
        for(let i=0;i<word.length; i++){
            html +=` <input type="text"  disabled>`;
        }
        inputs.innerHTML=html;
     
    }
     randomWord();

     function initGame(e){
        let key = e.target.value;

        if(key.match(/^[A-Za-z]+$/) && !incorrects.includes(` ${key} `)
        && !corrects.includes(key))
        {
             console.log(key)
             if(word.includes(key)){
                for(let i=0;i<word.length;i++){
                    if(word[i]===key){
                        corrects.push(key);
                       inputs.querySelectorAll ("input")[i].value=key
                    }
                }
             }
             else{
                maxGuesses--;
                incorrects.push(`${key}`);
                
             }
        guessLeft.innerText=maxGuesses;
        wrongLetter.innerText=incorrects;

        }
       
        typingInput.value ="";

    setTimeout(()=>{ if(corrects.length===word.length){
            alert(`Congrats ! You found the word. ${word.toUpperCase()}`);
            randomWord();
        }

       else if(maxGuesses <1){
            alert("Game Over! You don't have any more guesses");
            for(let i=0;i<word.length;i++){
               inputs.querySelectorAll("inputs")[i].value =word[i];
            }
        }
    });
}
     
     resetbtn.addEventListener("click",randomWord);
     typingInput.addEventListener("input",initGame);
     document.addEventListener("keydown",()=>typingInput.focus());
    
    
    