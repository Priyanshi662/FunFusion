var sub_btn = document.querySelector('.submit-btn');

var sub_btn2 = document.querySelector('.submit-btn2');

var out = document.querySelector('.output-section');

let male = ["Sohan", "Rohan", "Rakesh", "Siddhant", "Srinjay", "Sampurno", "Ayush", "Soumyabrato", "Mehdi", "Suman", "Surajit", "Anirban", "Ronaldo", "Messi", "Subham", "Ashim", "Kushal", "Plabon", "Bishak", "Rishi", "Spandan", "Sandeepan", "Arnab", "Atri", "Ankit", "Abhigyan", "Tukai", "Sampad", "Amit"];

let female = ["Adrija", "Sreshta", "Sohani", "Kritika", "Sudiksha", "Deepsikha", "Aditi", "Tania", "Anjali", "Urnisha", "Riya", "Piya", "Brishti", "Rimi", "Tuli", "Sweta", "Roshni", "Shreya", "Moubani", "Indrani", "Rituparna" , "Alia" , "Shraddha" , "Rasmika"];

async function generate() {
    let select = document.querySelector('select');

    if (select.value == "") {
        output.innerHTML = "Enter the Gender !!";
    } else {

        if(select.value == "male") {
            let ind = Math.floor(Math.random() * (male.length));
            out.innerHTML = male[ind];
        }else{
            let ind = Math.floor(Math.random() * (female.length));
            out.innerHTML = female[ind];
        }
    }
}

function serve() {
    let name = document.querySelector('.output-section');
    name.classList.remove("hide");
    sub_btn2.classList.remove("hide");
    sub_btn.classList.add("hide");
    generate();
}

function reset() {
    let name = document.querySelector('.output-section');
    name.classList.add("hide");
    sub_btn2.classList.add("hide");
    sub_btn.classList.remove("hide");
    out.innerHTML = "";
}

sub_btn.addEventListener('click', serve);

sub_btn2.addEventListener("click", reset);
