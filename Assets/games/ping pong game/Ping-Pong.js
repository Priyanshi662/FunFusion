const cvs = document.getElementById("pong")
const ctx = cvs.getContext('2d')
const winmsg = document.querySelector("button")

//drawing rectange(game board)
// creating user paddle

const user = {
x : 0,
y : cvs.height/2 - 90,
width:30,
height:180,
color:"#ffd32a", 
score:0
}
//computers paddle
const com = {
x : cvs.width - 30,
y : cvs.height/2 - 90,
width:30,
height:180,
color:"#ffd32a",
score:0
}

//creating ball
const ball = {
x : cvs.width/2,
y : cvs.height/2,
radius : 20,
speed : 10,
velocityX : 5,
velocityY : 5,
color : "white"
}


function drawRect(x,y,w,h,color){
ctx.fillStyle = color
ctx.fillRect(x,y,w,h)
}
//drawing net

const net = {
x : cvs.width/2 - 3,
y : 0,
width:6,
height:25,
color : "white"
}

function drawNet(){
for (let i = 0; i <= cvs.height; i+=35){
drawRect(net.x, net.y + i, net.width, net.height, net.color)
}
}

// Drawing circle(game ball)

function drawCircle(x,y,r,color){
ctx.fillStyle = color
ctx.beginPath()
ctx.arc(x,y,r,0,Math.PI*2,false)
ctx.strokeStyle = "yellow"
ctx.closePath()
ctx.fill()
}

// writing Text 

function drawText(text,x,y,color){
ctx.fillStyle = color
ctx.font = "7em fantasy"
ctx.strokeText(text,x,y)
ctx.strokeStyle = "blue"
}

function resetGame(){
ball.x = cvs.width/2
ball.y = cvs.height/2
ball.velocityX = 0
ball.velocityY = 0
}

function render(){
//creating canvas
drawRect(0, 0, cvs.width, cvs.height, "#ff3f34")

// draw net
drawNet()

//drawScore
drawText(user.score,cvs.width/4,cvs.height/5,"white")
drawText(com.score,3*cvs.width/4,cvs.height/5,"white")

//draw user and com paddle
drawRect(user.x,user.y,user.width,user.height,user.color)
drawRect(com.x,com.y,com.width,com.height,com.color)

//draw ball
drawCircle(ball.x,ball.y,ball.radius,ball.color)
}

//controlling users paddle
cvs.addEventListener("mousemove",paddleMove)
function paddleMove(evt){
let rect = cvs.getBoundingClientRect()
user.y = evt.clientY - rect.top - user.height/2
}

//collision detection

function collision(b,p){
b.top = b.y - b.radius
b.bottom = b.y + b.radius
b.left = b.x - b.radius
b.right = b.x + b.radius

p.top = p.y
p.bottom = p.y + p.height
p.left = p.x
p.right = p.x + p.width

return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom

}
function resetBall(){
ball.x = cvs.width/2
ball.y = cvs.height/2
ball.velocityX = -ball.velocityX
ball.speed = 10
}
/*
function restartGame(){
ball.velocityX = 5
ball.velocityY = 5
}*/


//update the game
function update(){
ball.x += ball.velocityX
ball.y += ball.velocityY

//AI for computer's paddle
let AILevel = 0.1
com.y += (ball.y - (com.y + com.height/2)) * AILevel


if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
ball.velocityY = -ball.velocityY
}
let player = (ball.x < cvs.width/2) ? user : com
if (collision(ball,player)){
ball.velocityX = -ball.velocityX

let cp = ball.y - (player.y + player.height/2)
cp = cp/(player.height/2)
let angleRad = cp * Math.PI/4
let direction = (ball.x < cvs.width/2 ? 1 : -1)
ball.velocityX = direction * ball.speed * Math.cos(angleRad)
ball.velocityY = ball.speed * Math.sin(angleRad)
ball.speed += 1
}
//update score
if (ball.x - ball.radius < 0){
com.score++
resetBall()
}else if(ball.x + ball.radius > cvs.width){
user.score++
resetBall()
}

if (collision(ball,player) && user.score === 7){
//winmsg.innerText = "YOU WON!"
//winmsg.classList.add("winningmsg")
resetGame()
restartGame()
}else if(collision(ball,player) && com.score === 7){
//winmsg.innerText = "YOU LOST!"
//winmsg.classList.add("winningmsg")
resetGame()
restartGame()
}
}

function game(){
render()
update()
}

const fps = 50
setInterval(game,1000/fps)
