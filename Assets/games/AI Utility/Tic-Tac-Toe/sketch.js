
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let w; // = width / 3;
let h; // = height / 3;

let ai = 'X';
let human = 'O';
let currentPlayer = human;

function setup() {
  createCanvas(400, 400);
  background(0);
  w = width / 3;
  h = height / 3;
  // Turn of Ai is first here :
  bestMove();
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}


function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

function mousePressed() {
  if (currentPlayer == human) {
    // Human make turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (board[i][j] == '') {
      board[i][j] = human;
      currentPlayer = ai;
      bestMove();
    }
  }
}

function draw() {
  
  background(80);
  strokeWeight(4);
  
  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      textSize(32);
      let r = w / 4;
      if (spot == human) {
        noFill();
        ellipse(x, y, r * 2);
      } else if (spot == ai) {
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  let result = checkWinner();
  if (result != null) {
    noLoop();
    let resultP = createP('');
    
    //styles here, classList.add didnt work
    resultP.style('font-size', '32pt');
    resultP.style('width','fit-content');
    resultP.style('margin','auto');
    resultP.style('padding-top','20pt');
    resultP.style('color', 'rgb(32,28,44)');
    //end of styles
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      resultP.html(`${result} Wins!`);
    }
  }
}








/* function how the game would look like without AI :
function nextTurn()
{
	let available=[];
	for(let i=0;i<3;i++)
	{
		for(let j=0;j<3;j++)
		{
			if(board[i][j]=='')
			{
				available.push({i,j});
			}
		}
		let move=random(available);
		board[move.i][move.j]=ai;
		currentPlayer=human;
	}
	let index=floor(random(available.length));
	// splice givesm values as an array
	let spot=available.splice(index,1)[0];
	int x=spot[0];
	int y=spot[1];
	// next player should be next index player
	board[x][y]=player[currentPlayer];
	currentPlayer=(currentPlayer+1)%players.length;
}*/
/*function mousePressed(){
	nextTurn();
}*/
