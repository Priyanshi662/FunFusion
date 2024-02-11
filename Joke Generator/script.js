var joke = document.querySelector('.joke');
var jokeBtn = document.querySelector('.btn');


async function generateJoke () {

    try {
        const setHeader = {
            headers : {
                Accept : 'application/json'
            }
        }
        joke.innerHTML = `Awesome Joke is Loading...`;
        const res = await fetch('https://icanhazdadjoke.com/' , setHeader); // await = wait till get data
        const data = await res.json(); // wait till data is converted to json file
        joke.innerHTML = data.joke;
    }catch(err) {
        console.log(err);
    }
}

jokeBtn.addEventListener('click' , generateJoke);
generateJoke(); // so that we get a joke on reload