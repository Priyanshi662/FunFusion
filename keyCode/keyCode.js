const insert = document.getElementById('insert');

const key = document.querySelector(".key");
const keycode = document.querySelector(".keyCode");
const code = document.querySelector(".code");



window.addEventListener('keydown',(e)=>{
    key.innerHTML = `${e.key == " "? "space" : e.key}`;
    keycode.innerHTML = `${e.keyCode}`;
    code.innerHTML = `${e.code}`;

    // insert.innerHTML = `
    //     <div class = 'table'>
    //         <table>
    //             <tr>
    //                 <th>key</th>
    //                 <th>keyCode</th>
    //                 <th>Code</th>
    //             </tr>
    //             <tr>
    //                 <td>${e.key == " "? "space" : e.key}</td>
    //                 <td>${e.keyCode}</td>
    //                 <td>${e.code}</td>
    //             </tr>
    //         </table>
    //     </div>    
    // `;




})