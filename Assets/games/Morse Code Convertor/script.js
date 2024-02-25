const morseToEnglishMap = {
    ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E",
    "..-.": "F", "--.": "G", "....": "H", "..": "I", ".---": "J",
    "-.-": "K", ".-..": "L", "--": "M", "-.": "N", "---": "O",
    ".--.": "P", "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
    "..-": "U", "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y",
    "--..": "Z", "-----": "0", ".----": "1", "..---": "2", "...--": "3",
    "....-": "4", ".....": "5", "-....": "6", "--...": "7", "---..": "8",
    "----.": "9", ".-.-.-": ".", "--..--": ",", "..--..": "?", "-.-.--": "!",
    " ": " ","":" "
};

const englishToMorseMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
    ' ': ' ',
};

function convertToMorse() {
    const englishInput = document.getElementById("englishInput").value.toUpperCase();
    let morseOutput = "";

    for (let i = 0; i < englishInput.length; i++) {
        if (englishToMorseMap[englishInput[i]]) {
            morseOutput += englishToMorseMap[englishInput[i]] + " ";
        } else {
            document.getElementById("errorMessage").innerText = "Invalid character in input!";
            return;
        }
    }

    document.getElementById("englishOutput").value = morseOutput.trim();
    document.getElementById("errorMessage").innerText = "";
}

function convertToEnglish() {
    const morseInput = document.getElementById("morseInput").value;
    const morseArray = morseInput.split(" ");
    console.log(morseArray);
    let englishOutput = "";

    for (let i = 0; i < morseArray.length; i++) {
        if (morseToEnglishMap[morseArray[i]]) {
            englishOutput += morseToEnglishMap[morseArray[i]];
        } else {
            document.getElementById("errorMessageMorse").innerText = "Invalid Morse Code!";
            return;
        }
    }

    document.getElementById("morseOutput").value = englishOutput;
    document.getElementById("errorMessageMorse").innerText = "";
}