let generateBtn = document.querySelector(".generate");
let popUp = document.querySelector(".popUp");

generateBtn.addEventListener("click", () => {
    popUp.classList.add("hide");
    let rgb1 = Math.floor(Math.random() * 256);
    let rgb2 = Math.floor(Math.random() * 256);
    let rgb3 = Math.floor(Math.random() * 256);

    let box = document.querySelector(".box");
    box.style.backgroundColor = `rgb(${rgb1}, ${rgb2}, ${rgb3})`;

    let show = document.querySelector(".show");
    show.classList.remove("hide");

    let colorCode = document.querySelector("#colorCode");
    colorCode.innerHTML = `color: rgb(${rgb1}, ${rgb2}, ${rgb3});`;

    let copyBtn = document.querySelector(".copy");

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(colorCode.innerHTML);
        popUp.classList.remove("hide");
    })
})