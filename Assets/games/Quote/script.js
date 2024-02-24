const quoteContainer = document.getElementById('quote-container')
const quoteText = document.getElementById('quote')
const authorText = document.getElementById('author')
const twitterBtn = document.getElementById('twitter')
const newQuoteBtn = document.getElementById('new-quote')
const loader = document.getElementById('loader')




let apiQuotes = []

// show new quote  
function newQuote() {
    loading()
    // Pick random quote from array
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)]
    authorText.textContent = quote.author

    quoteText.textContent = quote.text
    complete()
}

// Get Quote From API 
async function getQuotes() {
    loading()
    const apiUrl = 'https://type.fit/api/quotes'
    try {
        const response = await fetch(apiUrl)
        apiQuotes = await response.json()
        // console.log(apiQuotes[12]);
        newQuote()
    } catch (error) {
        // Catch Error Here 

    }
}

// On Load 
getQuotes()


// Tweet a quote 
function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`
    window.open(twitterUrl, '_blank')
}

// Event listeners
newQuoteBtn.addEventListener('click', newQuote)
twitterBtn.addEventListener('click', tweetQuote)


// Show loading
function loading() {
    loader.hidden = false
    quoteContainer.hidden = true
}

// Hide Loading 
function complete() {
    loader.hidden = true
    quoteContainer.hidden = false
}