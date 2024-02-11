"use strict";

  let autoStart;
  const mrandom = Math.random,
        mfloor = Math.floor,
        mhypot = Math.hypot;
//-----------------------------------------------------------------------------
function isMiniature() {
return location.pathname.includes('/fullcpgrid/');
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function alea (min, max) {
// random number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') return min * mrandom();
    return min + (max - min) * mrandom();
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function intAlea (min, max) {
// random integer number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') {
      max = min; min = 0;
    }
    return mfloor(min + (max - min) * mrandom());
  } // intAlea

//-----------------------------------------------------------------------------
  function arrayShuffle (array) {
/* randomly changes the order of items in an array
   only the order is modified, not the elements
*/
  let k1, temp;
  for (let k = array.length - 1; k >= 1; --k) {
    k1 = Math.floor((k + 1) * Math.random());
    temp = array[k];
    array[k] = array[k1];
    array[k1] = temp;
    } // for k
  return array
  } // arrayShuffle

//-----------------------------------------------------------------------------
// Menu class
/*
Vertical single level menu

It is called with an object containing the following properties:

  parentDiv : name of a div, or the div itself
  idDivMenu : id which will be attributed to the menu div (child of parentDiv)
  title : text for title of menu. remains visible when menu closed
  lineOffset : vertical position of 1st line of menu
  lineStep : vertical distance between top of two menu lines
  lines : Array. Each element of this array is an object with two properties :
          - text : text line
          - func : "onclick" callback associated with line

*/

function Menu(params) {

  let parentDiv = params.parentDiv;
  if (typeof(parentDiv) == 'string') parentDiv = document.getElementById(parentDiv);
// div menu
  let divMenu=document.createElement('div');
  divMenu.setAttribute ("id",params.idDivMenu);
// title
  let dt = document.createElement('div');
  dt.classList.add('title');
  dt.appendChild(document.createTextNode(params.title));
  let that = this;
  dt.addEventListener("click",()=>that.display());
  divMenu.appendChild(dt);
  this.list = [];  
  for (let k = 0; k < params.lines.length; ++k){
    dt=document.createElement('div');
    dt.classList.add('line');
    dt.appendChild(document.createTextNode(params.lines[k].text));
    dt.style.top=(params.lineOffset + k * params.lineStep) + "px";
    dt.addEventListener("click",params.lines[k].func);
    divMenu.appendChild(dt);
    this.list.push(dt);
  }
  divMenu.style.height = (params.lineOffset + params.lines.length * params.lineStep) +'px'
  this.divMenu = divMenu;
  parentDiv.appendChild(divMenu);

} // Menu

Menu.prototype.collapse = function() {
    this.divMenu.classList.remove('open');

}
Menu.prototype.display = function() {
    this.divMenu.classList.add('open');

}

//-------------------------------------------------------------------------

// Point - - - - - - - - - - - - - - - - - - - -
function Point(x,y) {
  this.x = Number(x);
  this.y = Number(y);
} // Point

Point.prototype.copy = function() {
  return new Point(this.x,this.y);
}
// end Point - - - - - - - - - - - - - - - - - - - -

// Segment - - - - - - - - - - - - - - - - - - - -
// those segments are oriented

function Segment(p1,p2) {
  this.p1=new Point(p1.x,p1.y);
  this.p2=new Point(p2.x,p2.y);
}

Segment.prototype.length = function() {
  var dx = this.p1.x - this.p2.x;
  var dy = this.p1.y - this.p2.y;
  return mhypot(dx, dy);
}
Segment.prototype.dx =function() {
  return this.p2.x-this.p1.x;
}
Segment.prototype.dy =function() {
  return this.p2.y-this.p1.y;
}


// returns a point at a given distance of p1, positive direction beeing towards p2

Segment.prototype.pointOnRelative = function (coeff) {
// attention if segment length can be 0
  var dx= this.p2.x-this.p1.x;
  var dy= this.p2.y-this.p1.y;
  return new Point(this.p1.x+coeff*dx, this.p1.y+coeff*dy);
}

// end Segment
//-------------------------------------------------------------------------
let uploadFile;
{ // scope for uploadFile

  let options, callBack;

  let elFile = document.createElement('input');
  elFile.setAttribute('type', 'file');
  elFile.style.display = 'none';
  elFile.addEventListener("change", getFile);

  function getFile() {

    if (this.files.length == 0) {
      returnLoadFile ({fail: 'no file'});
      return;
    }
    let file = this.files[0];
    let reader = new FileReader();

    reader.addEventListener('load', () => {
      if (options.image) options.image.src = reader.result;
      returnLoadFile ({success: reader.result, file: file});
    });
    reader.addEventListener('abort', () => {
      returnLoadFile ({fail: 'abort'});
    });
    reader.addEventListener('error', () => {
      returnLoadFile ({fail: 'error'});
    });

    if (options.image || options.readMethod == 'readAsDataURL')
      reader.readAsDataURL(this.files[0]);
    else
      reader.readAsText(this.files[0]);

  } // getFile

  function returnLoadFile(returnedValue) {
    callBack(returnedValue);
  }

uploadFile = function(ocallBack, ooptions) {
/* loads a file asynchronously
at the end of the process, calls the function 'callBack' with an object :

{fail: string} in case of failure, where string gives the reason of the failure
or
{success : string, file: file} where string is the content of the image file
   file represents the loaded file, and may be tested for file.type, file.name...

CAUTION ! If the user clicks 'cancel' when loading a file, nothing happens.

options is an object, with 0, one or more of the following properties :
accept : string to pass as "accept" attribute to the load file button, such as '.txt' or 'image/*'
            default : no value (will accept  * . * )
readMethod : 'readAsText' or 'readAsDataURL' - default is readAsText
image: if provided, must be an Image element. If possible, the data is loaded
with readAsDataURL, no matter the value of readMethod, and option.image.src is set to the data.
The function then returns normally as defined above.
Normally, a 'load' event should be triggered on the image.
*/

  options = ooptions;
  callBack = ocallBack;
  if (options.accept) elFile.setAttribute("accept", options.accept);
  else elFile.removeAttribute("accept");
  elFile.click();

} // uploadFile
} //  // scope for uploadFile

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// side of a piece

function Side() {
  this.type = ""; // "d" pour straight line or "z" pour classic
  this.points = []; // real points or Bezier curve points
} // Side

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

/* modifies this Side
  changes it from a straight line (type "d") to a complex one (type "z")
  The change is done towards the opposite side, between corners ca and cb
*/

Side.prototype.twist = function(ca, cb, tgx, tgy) {

  const seg0 = new Segment(this.points[0], this.points[1]);
  const dxh = seg0.dx();
  const dyh = seg0.dy();

  const seg1 = new Segment(ca, cb);
  const mid0 = seg0.pointOnRelative(0.5);
  const mid1 = seg1.pointOnRelative(0.5);

  const segMid = new Segment(mid0, mid1);
  const dxv = segMid.dx();
  const dyv = segMid.dy();

  const pa = pointAt(5 / 12, 1 / 12);
  const pb = pointAt(4 / 12, 3 / 12);
  const pc = pointAt(1 / 2, 4 / 12);
  const pd = pointAt(1 - 4 / 12, 3 / 12);
  const pe = pointAt(1 - 5 / 12, 1 / 12);

  this.points = [seg0.p1,
                  new Point(seg0.p1.x + 5 / 12 * dxh * 0.52,
                            seg0.p1.y + 5 / 12 * dyh * 0.52),
                  new Point (pa.x - 1 / 12 * dxv * 0.72,
                             pa.y - 1 / 12 * dyv * 0.72),
                  pa,
                  new Point (pa.x + 1 / 12 * dxv * 0.72,
                             pa.y + 1 / 12 * dyv * 0.72),

                  new Point (pb.x - 1 / 12 * dxv * 0.72,
                             pb.y - 1 / 12 * dyv * 0.72),
                  pb,
                  new Point (pb.x + 1 / 12 * dxv * 0.52,
                             pb.y + 1 / 12 * dyv * 0.52),
                  new Point (pc.x - 2 / 12 * dxh * 0.52 * tgx,
                             pc.y - 2 / 12 * dyh * 0.52 * tgy),
                  pc,
                  new Point (pc.x + 2 / 12 * dxh * 0.52 * tgx,
                             pc.y + 2 / 12 * dyh * 0.52 * tgy),
                  new Point (pd.x + 1 / 12 * dxv * 0.52,
                             pd.y + 1 / 12 * dyv * 0.52),
                  pd,
                  new Point (pd.x - 1 / 12 * dxv * 0.72,
                             pd.y - 1 / 12 * dyv * 0.72),
                  new Point (pe.x + 1 / 12 * dxv * 0.72,
                             pe.y + 1 / 12 * dyv * 0.72),
                  pe,
                  new Point (pe.x - 1 / 12 * dxv * 0.72,
                             pe.y - 1 / 12 * dyv * 0.72),
                  new Point(seg0.p2.x - 5 / 12 * dxh * 0.52,
                            seg0.p2.y - 5 / 12 * dyh * 0.52),
                  seg0.p2];
  this.type = "z";

  function pointAt (coeffh, coeffv) {
    return new Point (seg0.p1.x + coeffh * dxh + coeffv * dxv,
                      seg0.p1.y + coeffh * dyh + coeffv * dyv)
  }

} //
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

/*
draws the path corresponding to a side
Parameters :
  ctx : canvas context
  shiftx, shifty : position shift used to create shadow effect
  backwards : boolean, must be true for bottom and left sides, which must be drawn
      from the last point to the first
  withoutMoveTo : to decide whether to do a moveTo to the first point. Without MoveTo
  must be done only for the first side of a piece, not for the following ones
*/

Side.prototype.drawPath = function(ctx, shiftx, shifty, backwards, withoutMoveTo) {

  let k, mix, miy;

  if (backwards) {
    if (!withoutMoveTo) {
      ctx.moveTo(this.points[this.points.length - 1].x - shiftx, this.points[this.points.length - 1].y - shifty);
    }
    if(this.type == "d") {
      ctx.lineTo(this.points[0].x - shiftx, this.points[0].y - shifty);
    } else { // jigsaw side
      for (k = this.points.length - 2 ; k > 0; k -= 3) {
        ctx.bezierCurveTo(this.points[k].x - shiftx, this.points[k].y - shifty,
                             this.points[k - 1].x - shiftx, this.points[k - 1].y - shifty,
                             this.points[k - 2].x - shiftx, this.points[k - 2].y - shifty);
      } // for k
    } // if jigsaw side
  } else {
    if (!withoutMoveTo) {
      ctx.moveTo(this.points[0].x - shiftx, this.points[0].y - shifty);
    }
    if(this.type == "d") {
      ctx.lineTo(this.points[1].x - shiftx, this.points[1].y - shifty);
    } else { // edge zigzag
      for (k = 1 ; k < this.points.length - 1; k += 3) {
        ctx.bezierCurveTo(this.points[k].x - shiftx, this.points[k].y - shifty,
                          this.points[k + 1].x - shiftx, this.points[k + 1].y - shifty,
                          this.points[k + 2].x - shiftx, this.points[k + 2].y - shifty);
      } // for k
    } // if jigsaw side
  }
} // Side.prototype.drawPath

// end Side
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

function Piece(kx, ky) { // object with 4 sides
  this.ts = new Side(); // top side
  this.rs = new Side(); // right side
  this.bs = new Side(); // bottom side
  this.ls = new Side(); // left side
  this.kx = kx;
  this.ky = ky;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
/* draw path for one piece
  shiftx and shifty used for shadow effect
  does from beginPath to closePath, but not actually draw : no stroke nor fill nor clip here
*/

Piece.prototype.drawPath = function (ctx, shiftx, shifty, withoutBeginPath) {

  if (withoutBeginPath !== true) ctx.beginPath();

  this.ts.drawPath(ctx, shiftx, shifty, false, false); // top side
  this.rs.drawPath(ctx, shiftx, shifty, false, true);  // right side
  this.bs.drawPath(ctx, shiftx, shifty, true, true);   // bottom side
  this.ls.drawPath(ctx, shiftx, shifty, true, true);   // left

} //

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
/*
creates and returns a div for an individual piece, with a canvas with shadow, and a part of the picture
canvas and div are three times the average size of pieces
puzzle object given in parameters provides required elements
scale and x and y offsets allow to scale and truncate picture to actual size
*/

Piece.prototype.createDivPiece = function(puzzle, scale, offsx, offsy) {

  let ctx, shiftx, shifty;
  this.theDiv = document.createElement('div');
  this.theDiv.style.width = 3 * puzzle.dx + "px";
  this.theDiv.style.height = 3 * puzzle.dy + "px";
  this.theDiv.style.position = "absolute";

  this.theCanv = document.createElement('canvas');
  this.theCanv.width = 3 * puzzle.dx;
  this.theCanv.height = 3 * puzzle.dy;

// origine shifting for path drawing
  shiftx = puzzle.dx * (this.kx - 1);
  shifty = puzzle.dy * (this.ky - 1);

  ctx = this.ctx = this.theCanv.getContext("2d");
  this.drawPath(ctx, shiftx, shifty);

  ctx.clip();


  let sx, sy, sWidth, sHeight, dx, dy,dWidth, dHeight;
  if (this.kx == 0) {
    sx = 0 * puzzle.dx / scale + offsx; // won't work on safari if offsx < 0
    dWidth = 2 * puzzle.dx;
    dx = puzzle.dx;
  } else {
    sx = (this.kx - 1) * puzzle.dx / scale + offsx;
    dWidth = 3 * puzzle.dx;
    dx = 0;
  }
  sWidth = dWidth / scale;
  if (this.ky == 0) {
    sy = 0 * puzzle.dy / scale + offsy; // won't work on safari if offsy < 0
    dHeight = 2 * puzzle.dy;
    dy = puzzle.dy;
  } else {
    sy = (this.ky - 1) * puzzle.dy / scale + offsy;
    dHeight = 3 * puzzle.dy;
    dy = 0;
  }
  sHeight = dHeight / scale;
  
  ctx.drawImage(puzzle.image, sx, sy, sWidth, sHeight,
                              dx, dy, dWidth, dHeight);
// shadow effect
// depends on size of pieces

  let shift = 1, thickness = 2;
   if (puzzle.dx > 100 && puzzle.dy > 100) {
    shift = 2; thickness = 5;
  } else if (puzzle.dx > 50 && puzzle.dy > 50) {
    shift = 1.5; thickness = 3;
  }

  this.drawPath(ctx, shiftx + shift, shifty + shift);
  ctx.lineWidth = thickness;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.stroke();
  this.drawPath(ctx, shiftx - shift, shifty - shift);
  ctx.lineWidth = thickness;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.stroke();
  this.drawPath(ctx, shiftx, shifty); // path used for selection of the piece

/* place of the piece at the beginning of the game */
  this.moveTo(new Point((this.kx - 1) * puzzle.dx + Puzzle.MARGIN1,
                        (this.ky - 1) * puzzle.dy + Puzzle.MARGIN1));

  this.theDiv.appendChild(this.theCanv);

  return this.theDiv;
} // createDivPiece
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

// returns position of current piece

Piece.prototype.where = function() {
  let x, y;
  x = parseFloat(this.theDiv.style.left);
  y = parseFloat(this.theDiv.style.top);
  return new Point(x, y);
} // Piece.prototype.where

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
/* move piece to a given location
onePoint if location of top lefthand corner of div (far beyond visible par of piece)
*/
Piece.prototype.moveTo = function(onePoint) {
  this.theDiv.style.top = onePoint.y + "px";
  this.theDiv.style.left = onePoint.x + "px";
} // Piece.prototype.moveTo

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// true if given (mouse) coordoninates are inside the piece

Piece.prototype.insidePiece = function(x, y) {

  let styl = getComputedStyle(this.theDiv);
  let xloc = x - parseFloat(styl.left); // 'local' x and y
  let yloc = y - parseFloat(styl.top);

  return this.ctx.isPointInPath(xloc, yloc);

} // Piece.prototype.insidePiece

// fin Piece


//--------------------------------------------------------------
//--------------------------------------------------------------
// class PolyPiece
// represents a group of pieces well positionned with respect  to each other.
// pckxmin, pckxmax, pckymin and pckymax record each a piece with highest kx, lowest kx...


function PolyPiece(initialPiece, puzz) {
  this.pckxmin  =
  this.pckxmax  =
  this.pckymin  =
  this.pckymax = initialPiece;
  this.pieces = [initialPiece];
  this.puzzle = puzz;
} // PolyPiece

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
/*
  this method
    - adds pieces of otherPoly to this PolyPiece
    - adjusts coordinates of new pieces to make them consistent with this polyPiece
    - does not re - evaluate the z - index of the polyPieces
*/

PolyPiece.prototype.merge = function(otherPoly) {

  for (let k = 0; k < otherPoly.pieces.length; ++k) {
    this.pieces.push(otherPoly.pieces[k]);
    // watch leftmost, topmost... pieces
    if (otherPoly.pieces[k].kx < this.pckxmin.kx) this.pckxmin = otherPoly.pieces[k];
    if (otherPoly.pieces[k].kx > this.pckxmax.kx) this.pckxmax = otherPoly.pieces[k];
    if (otherPoly.pieces[k].ky < this.pckymin.ky) this.pckymin = otherPoly.pieces[k];
    if (otherPoly.pieces[k].ky > this.pckymax.ky) this.pckymax = otherPoly.pieces[k];
  } // for k

  this.moveTo(this.where()); // to set positions of new pieces

// sort the pieces by increasing kx, ky

  this.pieces.sort(function(p1, p2){
       if (p1.ky < p2.ky) return  - 1;
       if (p1.ky > p2.ky) return 1;
       if (p1.kx < p2.kx) return  - 1;
       if (p1.kx > p2.kx) return 1;
       return 0; // should not occur
       });

} // merge

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
PolyPiece.prototype.where = function() {
  return this.pieces[0].where();
} // PolyPiece.prototype.where

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// the position of the PolyPiece is this of its 1st piece
// the position of the others is evaluated on this basis

PolyPiece.prototype.moveTo = function(pnt) {

  this.pieces[0].moveTo(pnt);
  for (let kp = 1; kp < this.pieces.length; ++kp) {
    this.pieces[kp].moveTo(new Point(pnt.x + this.puzzle.dx * (this.pieces[kp].kx - this.pieces[0].kx ),
                                     pnt.y + this.puzzle.dy * (this.pieces[kp].ky - this.pieces[0].ky )));
  } // for kp
} // PolyPiece.prototype.moveTo

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
PolyPiece.prototype.ifNear = function(otherPoly) {

  let p1, p2;
  for (let kp = 0; kp < this.pieces.length; ++kp) {
    p1 = this.pieces[kp];
    for (let kn = 0; kn < otherPoly.pieces.length; ++kn) {
      p2 = otherPoly.pieces[kn];
// p2 above p1 ?
      if ((p1.kx == p2.kx && p1.ky == p2.ky + 1) &&
          (this.puzzle.near(p1, p2, 0, - 1))) return true;
// p2 below p1 ?
      if ((p1.kx == p2.kx && p1.ky == p2.ky - 1) &&
          (this.puzzle.near(p1, p2, 0, 1))) return true;
// p2 left of p1 ?
      if ((p1.kx - 1 == p2.kx && p1.ky == p2.ky) &&
          (this.puzzle.near(p1, p2, - 1, 0))) return true;
// p2 right of p1 ?
      if ((p1.kx + 1 == p2.kx && p1.ky == p2.ky) &&
          (this.puzzle.near(p1, p2, + 1, 0))) return true;
    } // for kn
  } // for kp
  return false; // no, not near
} // ifNear

// end class PolyPiece
//--------------------------------------------------------------
//--------------------------------------------------------------
// puzzle

/* see createPuzzle for the 'params' parameter
This constructor is used to load the picture, the actual construction of the
puzzle can't be done before picture dimensions are known
*/

function Puzzle(params) {

// image - by url (src) or straight image object
  if (typeof(params.img) == 'string') {
    this.image = new Image();
    this.image.src = params.img;
    this.image.addEventListener("load", (function(obj){
      return function() {
        obj.createPuzzle(params);
      }})(this));
  } else {
    this.image = params.img;
    this.createPuzzle(params);
  }

} // Puzzle

Puzzle.MARGIN1 = 5;
//--------------------------------------------------------------

/*
The given parameter if an object with the following properties :
 -  img, which may be:
  string type : an image url
  object type : an image object (with a ready loaded image)
 -  width : width available for the picture
 -  height : width available for the picture. The script will use the
width x height space as smartly as possible
 -  npieces : number of pieces. May be any (sensible) integer, the script
will choose a number of columns and rows to have pieces as square as possible,
and an actual total number of pieces as close as possible to this integer.
 -  idiv : div which will contail the game

*/

Puzzle.prototype.createPuzzle = function(params){

//  let kx, ky, x, y, dx, dy, p1, p2, p3, brd, s1, s2, s3, s4, s5, s6, s7, s8, s9, concav, width, height, nx, ny;

// we change width or height in order to keep the picture size ratio
  let wi = this.image.width;  // from original picture
  let he = this.image.height;

  this.reqHeight = params.height; // requested height
  this.reqWidth = params.width;
  this.height = this.reqHeight - 2 * Puzzle.MARGIN1; // place left on screen including margin
  this.width = this.reqWidth - 2 * Puzzle.MARGIN1; //

  if (wi / he > this.width / this.height) { // actual picture "more horizontal" than game board
    this.height = this.width * he / wi;
  } else {
    this.width = this.height * wi / he;
  }
// end change width or height

// div Game - by name (id) or directly an object
  if (typeof(params.idiv) == 'string') {
    this.divGame = document.getElementById(params.idiv);
  } else {
    this.divGame = params.idiv;
  }
  this.divGame.style.overflow = 'visible';
  this.divGame.style.position = 'relative';

// divBoard
  if (!this.divBoard) {
    this.divBoard = document.createElement('div');
    this.divGame.appendChild(this.divBoard);
  }
  this.divBoard.style.overflow = 'hidden';
  this.divBoard.style.position = 'absolute';
  this.divBoard.style.left = 0;
  this.divBoard.style.top = 0;

  this.listeners = []; // table of eventListeners to remove

/* provisional dimensions of the game, waiting for actual dimensions which depend
on number of pieces
*/

  this.divGame.style.width = this.divBoard.style.width = this.width + 2 * Puzzle.MARGIN1 + "px";
  this.divGame.style.height = this.divBoard.style.height = this.height + 2 * Puzzle.MARGIN1 + "px";

// canv for the moving PolyPiece and the full image
  if (!this.canvMobile) {
    this.canvMobile = document.createElement('canvas');
    this.divBoard.appendChild(this.canvMobile);
  }
  this.canvMobile.style.visibility = 'visible';
  this.canvMobile.width = parseFloat(this.divBoard.style.width);
  this.canvMobile.height = parseFloat(this.divBoard.style.height);
  this.canvMobile.style.position = "absolute";
  this.canvMobile.style.top = "0px";
  this.canvMobile.style.left = "0px";

  this.canvMobile.style.zIndex = 50000;

  this.dCoupling = 10; // distance for pieces to couple together, in pixels (on each x and y axis)

  this.canvMobile.getContext("2d").drawImage(this.image,
                            0, 0, wi, he,
                            Puzzle.MARGIN1, Puzzle.MARGIN1, this.width, this.height);


  if (!this.menu) {
    this.menu = new Menu({
      parentDiv: this.divGame,
      idDivMenu: "divmenu",
      title: "MENU",
      lineOffset: 30,
      lineStep: 30,
      lines: [
        {text: "load image", func: this.loadImage()},
        {text: "12 piece", func: this.returnFunct(12)},
        {text: "25 piece", func: this.returnFunct(25)},
        {text: "50 piece", func: this.returnFunct(50)},
        {text: "100 piece", func: this.returnFunct(100)},
        {text: "200 piece", func: this.returnFunct(200)}
      ]
    });
  }
  if (autoStart) {
     this.npieces = 25;
     this.next();
  }
} // createPuzzle
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// function for menu actions

Puzzle.prototype.returnFunct = function(nbpieces) {

  let puz = this;
    return function() {
     puz.menu.collapse();
     puz.npieces = nbpieces;
     puz.next();
    }
} // returnFunct

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

Puzzle.prototype.loadImage = function () {

  let puz = this;
  return function() {
    puz.menu.collapse();
    uploadFile(() => {},
              {accept: 'image/*',
               readMethod: 'readAsDataURL',
               image: puz.image});
    }
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

Puzzle.prototype.next = function() {

  let nx, ny, np, dx, dy, kx, ky, x, y, p1, p2, p3, brd, s1, s2, s3, s4, s5, s6, s7, s8, s9, concav;
/* parameters for the shape of pieces edges
*/

  let coeffDecentr = 0.12;

  this.canvMobile.style.visibility = 'hidden'; // hide the full picture

// evaluation of number of pieces

  this.computenxAndny();
  nx = this.nx;  ny = this.ny;

// re - evaluation of the dimensions of the picture, leaving a space for pieces on one side

  if (this.image.width / this.image.height <
       (this.reqWidth - 2 * Puzzle.MARGIN1) / (this.reqHeight - 2 * Puzzle.MARGIN1)) {
  /* actual picture "more vertical" than available place
    leave place on the right side */
    this.width = (this.reqWidth - 2 * Puzzle.MARGIN1) / (nx + 2) * nx;
    this.height = this.width / this.image.width * this.image.height;
    if (this.height > this.reqHeight - 2 * Puzzle.MARGIN1) {
      this.height = this.reqHeight - 2 * Puzzle.MARGIN1;
      this.width = this.height * this.image.width / this.image.height;
    }
    this.freeSpace = 0; // place left on the right
  } else {
/* actual picture "more horizontal" than available place
    leave place on the bottom side */
    this.height = (this.reqHeight - 2 * Puzzle.MARGIN1) / (ny + 2) * ny;
    this.width = this.height / this.image.height * this.image.width;
    if (this.width > this.reqWidth - 2 * Puzzle.MARGIN1) {
      this.width = this.reqWidth - 2 * Puzzle.MARGIN1;
      this.height = this.width * this.image.height / this.image.width;
    }
    this.freeSpace = 1; // place left under
  }

  let height = this.height, width = this.width;
  this.dx = dx = this.width / nx; // horizontal side of tiling
  this.dy = dy = this.height / ny; // vertical side of tiling

/* adjust coupling distance to size of tiles */
  this.dCoupling = Math.max(10, Math.min(dx, dy) / 10);

// "clean" the board
  while (this.divBoard.firstChild) this.divBoard.removeChild(this.divBoard.firstChild);
// but keep the canvMobile
  this.divBoard.appendChild(this.canvMobile);

  this.canvMobile.width = this.reqWidth;
  this.divGame.style.width
    = this.divBoard.style.width
    = this.canvMobile.width + "px";

  this.canvMobile.height = this.reqHeight;
  this.divGame.style.height
    = this.divBoard.style.height
    = this.canvMobile.height + "px";

// compute the shapes of the pieces

/* first, place the corners of the pieces
  at some distance of their theorical position, except for edges
*/

  let corners = [];
  for (ky = 0; ky <= ny; ++ky) {
    corners[ky] = [];
    for (kx = 0; kx <= nx; ++kx) {
      corners[ky][kx] = new Point((kx + alea(-coeffDecentr, coeffDecentr)) * dx, (ky + alea(-coeffDecentr, coeffDecentr)) * dy);
      if (kx == 0) corners[ky][kx].x = 0;
      if (kx == nx) corners[ky][kx].x = this.width;
      if (ky == 0) corners[ky][kx].y = 0;
      if (ky == ny) corners[ky][kx].y = this.height;
    } // for kx
  } // for ky

// Array of raw pieces (straight sides)
  this.pieces = [];
  for (ky = 0; ky < ny; ++ky) {
    this.pieces[ky] = [];
    for (kx = 0; kx < nx; ++kx) {
      this.pieces[ky][kx] = np = new Piece(kx, ky);
// top side
      if (ky == 0) {
        np.ts.points = [corners[ky][kx],corners[ky][kx + 1]];
        np.ts.type = "d";
      } else {
        np.ts = this.pieces[ky - 1][kx].bs;
      }
// right side
      np.rs.points = [corners[ky][kx + 1],corners[ky + 1][kx + 1]];
      np.rs.type = "d";
      if (kx < nx - 1) {
        if (intAlea(2)) // randomly twisted one one side of the side
          np.rs.twist(corners[ky][kx],corners[ky + 1][kx], 0.5, 1);
        else
          np.rs.twist(corners[ky][kx + 2],corners[ky + 1][kx + 2], 0.5, 1);
      }
// left side
      if (kx == 0) {
        np.ls.points = [corners[ky][kx],corners[ky + 1][kx]];
        np.ls.type = "d";
      } else {
        np.ls = this.pieces[ky][kx - 1].rs
      }
// bottom side
      np.bs.points =[corners[ky + 1][kx],corners[ky + 1][kx + 1]];
      np.bs.type = "d";
      if (ky < ny - 1) {
        if (intAlea(2)) // randomly twisted one one side of the side
          np.bs.twist(corners[ky][kx],corners[ky][kx + 1], 1, 0.5);
        else
          np.bs.twist(corners[ky + 2][kx],corners[ky + 2][kx + 1], 1, 0.5);
      }
    } // for kx
  } // for ky
  this.associateImage();

} // function next

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// called when picture is loaded

Puzzle.prototype.associateImage = function() {
  let kx, ky, kn, kp;
  let div, scale, he, wi, offsx, offsy, pc;

  // scale picture
  wi = this.image.width;
  he = this.image.height;

  if (wi / he > this.width / this.height) { // actual picture "more horizontal" than board
    scale = this.height / he;
    offsy = 0;
    offsx = (wi - this.width / scale) / 2; // offset in source picture
  } else { // actual picture "more (or equally)horizontal" than board
    scale = this.width / wi;
    offsx = 0;
    offsy = (he - this.height / scale) / 2; // offset in source picture
  }

  this.mech =  { scale: scale, offsx: offsx, offsy: offsy }; // informations for scaling

// creation of pieces
// table of PolyPieces
  this.polyPieces = [];

  for (ky = 0; ky < this.ny; ky++) {
    for (kx = 0; kx < this.nx; kx++) {
      this.pieces[ky][kx].createDivPiece(this, scale, offsx, offsy);
      this.polyPieces.push(new PolyPiece(this.pieces[ky][kx], this));
    } // for kx
  } // for ky

// random zindex for initial pieces
  arrayShuffle(this.polyPieces);
  this.evaluateZIndex();

  for (kp = 0; kp < this.polyPieces.length; kp++) {
    for (kn = 0; kn < this.polyPieces[kp].pieces.length; kn++) {
      pc = this.polyPieces[kp].pieces[kn];

      this.divBoard.appendChild(pc.theDiv);
      switch(this.freeSpace){
        case 0 : pc.pTarget = new Point(this.reqWidth - (2.25 + Math.random() / 4) * this.dx, Math.random() * (this.height -  this.dy) - this.dy);break;
        case 1 : pc.pTarget = new Point(Math.random() * (this.width -  this.dx) - this.dx, this.reqHeight - (2.25 + Math.random() / 4) * this.dy);
      } // switch
    } // for kn
  } // for kp
  window.setTimeout((function(obj) {return function() {obj.launchAnimation()}})(this), 1000);

} // Puzzle.prototype.associateImage

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

Puzzle.prototype.addRemovableEventListener = function(event, funct) {

  this.divBoard.addEventListener(event, funct);
  this.listeners.push({event: event, funct: funct});
} // Puzzle.prototype.addRemovableEventListener
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
Puzzle.prototype.removeAllListeners = function() {
  let a;
  while (this.listeners.length > 0 ) {
    a = this.listeners.pop();
    this.divBoard.removeEventListener(a.event, a.funct);
  } // while
} // Puzzle.prototype.removeAllListeners()
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

Puzzle.prototype.launchAnimation = function() {

  this.anim = {cpt: autoStart ? 200 : 100 };
  this.anim.tmr = window.setInterval((function(puzz){return function(){puzz.animate()}})(this), 20);

} // launchAnimation
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

Puzzle.prototype.animate = function() {
  let kp, kn, pc, act, cib;

  if (this.anim.cpt == 0){
    window.clearInterval(this.anim.tmr);
    delete this.anim;

    this.evaluateZIndex();
    this.beginGame();

    return;
  }
  this.anim.cpt--;
  for (kp = 0; kp < this.polyPieces.length; kp++) {
    for (kn = 0; kn < this.polyPieces[kp].pieces.length; kn++) {
      pc = this.polyPieces[kp].pieces[kn];
      act = pc.where();
      cib = pc.pTarget;
      pc.moveTo(new Point((this.anim.cpt * act.x + cib.x) / (this.anim.cpt + 1), (this.anim.cpt * act.y + cib.y) / (this.anim.cpt + 1)));
      if (this.anim.cpt == 0) { delete pc.pTarget ; }
    } // for kn
  } // for kp
} // Puzzle.prototype.animate

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// almost the same as 'animate, mais only to center the picture when game is over

Puzzle.prototype.animateEnd = function() {
  let xcou, ycou;

  if (this.anim.cpt == 0){
    window.clearInterval(this.anim.tmr);
    delete this.anim;
    return;
  }
  this.anim.cpt--;
  xcou = parseFloat(this.canvMobile.style.left);
  ycou = parseFloat(this.canvMobile.style.top);

  this.canvMobile.style.left = (this.anim.cpt * xcou + this.anim.xfin) / (this.anim.cpt + 1) + "px";
  this.canvMobile.style.top = (this.anim.cpt * ycou + this.anim.yfin) / (this.anim.cpt + 1) + "px";

} // Puzzle.prototype.animateEnd


// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// merges polyPieces[n2] and polyPieces[n1] into a new piece
// removes those pieces and inserts nes one
// re evaluates z-orders accordingly
// return index of new polyPiece

Puzzle.prototype.merge = function(n1, n2) {

  let nppiece, nbpieces, k;
  this.polyPieces[n1].merge(this.polyPieces[n2]); // merges pieces
  nppiece = this.polyPieces[n1]; // save new piece
  if (n1 > n2) {
    this.polyPieces.splice(n1, 1);
    this.polyPieces.splice(n2, 1);
  } else {
    this.polyPieces.splice(n2, 1);
    this.polyPieces.splice(n1, 1);
  }

// will insert nes PolyPiece immediately before the first with less pieces
  nbpieces = nppiece.pieces.length;
  for (k = 0; k < this.polyPieces.length && this.polyPieces[k].pieces.length >= nbpieces; k++) {;}
  // insert new
  this.polyPieces.splice(k, 0, nppiece);

  return k;
} // puzzle.prototype.merge

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

Puzzle.prototype.evaluateZIndex = function() {

  let kp, kn, z;
  z = 1;
  for (kp = 0; kp < this.polyPieces.length; kp++) {
    for (kn = 0; kn < this.polyPieces[kp].pieces.length; kn++) {
      this.polyPieces[kp].pieces[kn].theDiv.style.zIndex = z++;
    } // for kn
  } // for kp

} // Puzzle.prototype.evaluateZIndex

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// beginning of game
Puzzle.prototype.beginGame = function() {

// record offset between mouse coordinates et board origin

  let styl = getComputedStyle(this.divGame);
  this.mouseOffsX = this.divGame.offsetLeft + parseFloat(styl.borderLeftWidth);
  this.mouseOffsY = this.divGame.offsetTop + parseFloat(styl.borderTopWidth);
  this.pieceMove = false; // no selected piece
// set event listeners
  this.addRemovableEventListener("mousedown", (function(puzzle){
                                                return function(event) {
                                                    event.preventDefault();
                                                    let [x,y] = [event.clientX,event.clientY];
                                                    let newEvent = {x: x, y: y, buttons: event.buttons, origin: "mouse"};
                                                    puzzle.mouseDownGame(newEvent);}})(this));
  this.addRemovableEventListener("mouseup", (function(puzzle){
                                                return function(event) {
                                                    event.preventDefault();
                                                    let [x,y] = [event.clientX,event.clientY];
                                                    let newEvent = {x: x, y: y, buttons: event.buttons, origin: "mouse"};
                                                    puzzle.mouseUpGame(newEvent);}})(this));
  this.addRemovableEventListener("mousemove", (function(puzzle){
                                                return function(event) {
                                                    event.preventDefault();
                                                    let [x,y] = [event.clientX,event.clientY];
                                                    let newEvent = {x: x, y: y, buttons: event.buttons, origin: "mouse"};
                                                    puzzle.mouseMoveGame(newEvent);}})(this));

  this.addRemovableEventListener("touchstart", (function(puzzle){
                                                return function(event) {
                                                    event.preventDefault();
                                                    if (event.touches.length != 1) return;
                                                    let [x,y] = [event.touches[0].clientX,event.touches[0].clientY];
                                                    let newEvent = {x: x, y: y, buttons: null, origin: "touch"};
                                                    puzzle.mouseDownGame(newEvent);}})(this));
  this.addRemovableEventListener("touchend", (function(puzzle){
                                                return function(event) {
                                                    event.preventDefault();
                                                    let newEvent = {origin: "touch"};
                                                    puzzle.mouseUpGame(newEvent);}})(this));
  this.addRemovableEventListener("touchcancel", (function(puzzle){
                                                return function(event) {
                                                    event.preventDefault();
                                                    let newEvent = {origin: "touch"};
                                                    puzzle.mouseUpGame(newEvent);}})(this));
  this.addRemovableEventListener("touchmove", (function(puzzle){
                                                return function(event) {
                                                    event.preventDefault();
                                                    if (event.touches.length != 1) return;
                                                    let [x,y] = [event.touches[0].clientX,event.touches[0].clientY];
                                                    let newEvent = {x: x, y: y, buttons: null, origin: "touch"};
                                                    puzzle.mouseMoveGame(newEvent);}})(this));
} // Puzzle.prototype.beginGame

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

// mouseDown during game
Puzzle.prototype.mouseDownGame = function(event) {

  this.pieceMove = this.lookForPiece(event) ;
  if (this.pieceMove === false) return;
  this.emphasize(this.pieceMove.pp);
// we will add to the 'this.pieceMove' object the offset between mousePosition and
//   canvMobile position for proper movement of canvMobile when mouse moves

  this.pieceMove.offsx =  event.x - this.mouseOffsX - parseFloat(this.canvMobile.style.left);
  this.pieceMove.offsy =  event.y - this.mouseOffsY - parseFloat(this.canvMobile.style.top);
  this.divGame.style.cursor = 'move';

} // Puzzle.prototype.mouseDownGame
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

// mouseUp during game
Puzzle.prototype.mouseUpGame = function(event) {

  let k, polyP, pc;

  this.divGame.style.cursor = 'default';

  if (this.pieceMove === false) return;

// hide the canvasMobile which was used for the moving piece
  let canvx = parseFloat(this.canvMobile.style.left);
  let canvy = parseFloat(this.canvMobile.style.top);
  this.canvMobile.getContext("2d").clearRect(0, 0, this.canvMobile.width, this.canvMobile.height);

// display again original pieces
  polyP = this.polyPieces[this.pieceMove.pp];
  for (k = 0; k < polyP.pieces.length; k++) {
    pc = polyP.pieces[k]
    pc.moveTo (new Point( this.dx * (pc.kx - 1) + canvx, this.dy * (pc.ky - 1) + canvy));
    pc.theDiv.style.visibility = 'visible';
  } // for k

// check if moved piece is close enough of another to merge them
//  check again with the result of the merge operation

  let idp = this.pieceMove.pp;
  let yesMerge = false, yesyesMerge = false;
  do {
    yesMerge = false;
    polyP = this.polyPieces[idp];
    for (k = 0; k < this.polyPieces.length; k++) {
      if (k ===  idp) continue; // don't check neighborhood with itself !
      if (polyP.ifNear(this.polyPieces[k])) { // yes !
        idp = this.merge(k, idp); // merge and keep track of index of merged piece
        yesMerge = true; yesyesMerge = true; // 2 pieces merging
        break; // out of  'for' loop
      } // if we found a piece
    } // for
  } while (yesMerge) ; // do it again if pieces werge merged

// if no merging, move (if this.polypieces) the selected PolyPiece before
// those with the same number of pieces

  if (! yesyesMerge) {
    let tmp = this.polyPieces[idp]; // memorize polyPiece
    this.polyPieces.splice(idp, 1); // remove from list
    for (k = idp; (k < this.polyPieces.length) && (this.polyPieces[k].pieces.length >= tmp.pieces.length); k++) ;
    this.polyPieces.splice(k, 0, tmp); // re-insert at the right place
  } // if no merging

  this.evaluateZIndex();
  this.pieceMove = false;

// won ?
  if (this.polyPieces.length > 1) return; // no, continue

// YES ! tell the player
  this.removeAllListeners();
// normal image is re-drawn
  let ctx = this.canvMobile.getContext("2d");
  ctx.drawImage(this.image,
                this.mech.offsx, this.mech.offsy,
                this.width / this.mech.scale, this.height / this.mech.scale,
                0, 0,
                this.width, this.height);
  this.anim = {cpt: 100, xorg: 0, yorg: 0, xfin: (this.reqWidth - this.dx * this.nx) / 2,
                                   yfin: (this.reqHeight - this.dy * this.ny) / 2};

  this.anim.xorg = parseFloat(this.polyPieces[0].pieces[0].theDiv.style.left) + this.dx;
  this.anim.yorg = parseFloat(this.polyPieces[0].pieces[0].theDiv.style.top) + this.dy
  this.canvMobile.style.left = this.anim.xorg + "px";
  this.canvMobile.style.top = this.anim.yorg + "px";

// hide pieces
  for (k = 0; k < this.polyPieces[0].pieces.length; k++) {
    this.polyPieces[0].pieces[k].theDiv.style.visibility = "hidden";
  } // for k

// launch final animation

  let dist = Math.sqrt(
             (this.anim.xorg - this.anim.xfin) * (this.anim.xorg - this.anim.xfin) +
             (this.anim.yorg - this.anim.yfin) * (this.anim.yorg - this.anim.yfin));
// we want a speed of about 100 pix / s
// the time increment beeing of 20 ms, this leads to 100 * 0.02 = 2 pix / pass
    this.anim.cpt = dist / 2;
// limit the duration to the range 0.25..2s, i.e.12..100 steps
    if (this.anim.cpt < 12) this.anim.cpt = 12;
    if (this.anim.cpt > 100) this.anim.cpt = 100;
    this.anim.cpt = Math.floor(this.anim.cpt);
  this.anim.tmr = window.setInterval((function(puzz){return function(){puzz.animateEnd()}})(this), 20);

} // Puzzle.prototype.mouseUpGame
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

// mouseMove during game
Puzzle.prototype.mouseMoveGame = function(event) {

  if (this.pieceMove === false) return;

// for the case where button was released out of 'good' area
  if (event.origin == "mouse") {    
    if ((event.buttons & 1) == 0) { this.mouseUpGame(event); return; }
  }
  
  let x =  event.x - this.mouseOffsX;
  let y =  event.y - this.mouseOffsY;
  if (x < 2) x = 2;
  if (x > Math.floor(parseFloat(this.divBoard.style.width)) - 2) x  = Math.floor(parseFloat(this.divBoard.style.width)) - 2;
  if (y < 2) y = 2;
  if (y > Math.floor(parseFloat(this.divBoard.style.height)) - 2) y  = Math.floor(parseFloat(this.divBoard.style.height)) - 2;

  this.canvMobile.style.left = (x - this.pieceMove.offsx) + "px";
  this.canvMobile.style.top = (y - this.pieceMove.offsy) + "px";

} // Puzzle.prototype.mouseMoveGame

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// searches the pieces whick was clicked on
// event is the click event
// returned value : (index of PolyPiece + piece) or false (if not on a piece)

Puzzle.prototype.lookForPiece = function(event) {

  let kp, kn, z;
  let x =  event.x - this.mouseOffsX;
  let y =  event.y - this.mouseOffsY;
  for (kp = this.polyPieces.length - 1; kp >= 0; kp--) {
    for (kn = this.polyPieces[kp].pieces.length - 1; kn >= 0; kn--) {
      if (this.polyPieces[kp].pieces[kn].insidePiece(x, y)) return {pp: kp, pc: kn};
    } // for kn
  } // for kp

  return false; // found nothing
} // Puzzle.prototype.lookForPiece

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
// emphasizes a polyPiece
// its idividualpieces are masked (style.visibility = "hidden")
// but they are collectively drawn on canvMobile
// parameter : polyPiece index

Puzzle.prototype.emphasize = function(npp) {

  let kbcl, kc, k;
  let ppc = this.polyPieces[npp]; // current PolyPiece
  let ctx = this.canvMobile.getContext("2d");
  let loops = lookForLoops(ppc.pieces);
  let edge;

  ctx.save();
  ctx.clearRect(0, 0, this.canvMobile.width, this.canvMobile.height);
  ctx.beginPath();
  for (kbcl = 0;kbcl < loops.length; kbcl++) {
    for (kc = 0; kc < loops[kbcl].length; kc++) {
      edge = loops[kbcl][kc];

      switch (edge.edge) {
        case 0 : ppc.pieces[edge.kp].ts.drawPath(ctx, 0, 0, false, (kc!= 0)); break;
        case 1 : ppc.pieces[edge.kp].rs.drawPath(ctx, 0, 0, false, (kc!= 0)); break;
        case 2 : ppc.pieces[edge.kp].bs.drawPath(ctx, 0, 0, true, (kc!= 0)); break;
        case 3 : ppc.pieces[edge.kp].ls.drawPath(ctx, 0, 0, true, (kc!= 0)); break;
      }
    } // for kc
  } // for kbcl;

// make shadow
  ctx.fillStyle = 'none';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.fill();

// add image clipped by path
  ctx.clip('evenodd');

  ctx.drawImage(this.image,
                this.mech.offsx, this.mech.offsy,
                this.width / this.mech.scale, this.height / this.mech.scale,
                0, 0,
                this.width, this.height);

// hide original PolyPiece
  for (k = 0; k < ppc.pieces.length; k++) {
    ppc.pieces[k].theDiv.style.visibility = "hidden";
  } // for k

  ctx.restore();

// set picture position to hide previous one
  this.canvMobile.style.left = (ppc.pieces[0].where().x - (ppc.pieces[0].kx - 1) * this.dx) + "px";
  this.canvMobile.style.top = (ppc.pieces[0].where().y - (ppc.pieces[0].ky - 1) * this.dy) + "px";
  this.canvMobile.style.visibility = 'visible';

} // emphasize

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -

// checks if p1 and p2 pieces are close to each other
// dx is -1, 0 or 1 to check left, (top or bottom) or right side of p1
// dy is -1, 0 or 1 to check top, (left or right) or bottom of p2

Puzzle.prototype.near  = function (p1, p2, dx, dy) {
  let ou1 = p1.where();
  let ou2 = p2.where();

  if (Math.abs (ou1.x - ou2.x + dx * this.dx) > this.dCoupling) return false;
  if (Math.abs (ou1.y - ou2.y + dy * this.dy) > this.dCoupling) return false;
  return true;
} // near

// fin class puzzle

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -   -
/* computes the number of lines and columns of the puzzle,
  finding the best compromise between the requested number of pieces
  and a square shap for pieces
*/

Puzzle.prototype.computenxAndny = function() {

  let kx, ky, width = this.image.width, height = this.image.height, npieces = this.npieces;
  let err, err2, errmin = 1e9;
  let ncv, nch;

  let nHPieces = Math.round(Math.sqrt(npieces * width / height));
  let nVPieces = Math.round(npieces / nHPieces);


/* based on the above estimation, we will try up to + / - 2 values
   and evaluate (arbitrary) quality criterion to keep best result
*/

  for (ky = 0;ky < 5;ky++) {
    ncv = nVPieces + ky - 2;
    for (kx = 0;kx < 5;kx++) {
      nch = nHPieces + kx - 2;
      err = nch * height / ncv / width;
      err = (err + 1 / err) - 2; // error on pieces dimensions ratio)
      err += Math.abs(1 - nch * ncv / npieces); // adds error on number of pieces

      if (err < errmin) { // keep smallest error
        errmin = err;
        this.nx = nch;
        this.ny = ncv;
      }
    } // for kx
  } // for ky

} // computenxAndny

//---------------------------------------------------------------------------- -
//---------------------------------------------------------------------------- -

/* algorithm to determine the boundary of a PolyPiece
  input : a table of cells, hopefully defining a 'good' PolyPiece, i.e. all connected together
  every cell is given as an object {kx: indice, ky: indice} representing an element of a 2D array.

  returned value : table of Loops, because the boundary may be made of several
simple loops : there may be a 'hole' in a PolyPiece
every loop is a list of consecutive edges,
every edge if an object {kp: index, edge: b} where kp is the index of the cell ine
the input array, and edge the side (0(top), 1(right), 2(bottom), 3(left))
every edge contains kx and ky too, normally not used here
*/

function lookForLoops (tbCases) {

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// internal : checks if an edge given by kx, ky is common with another cell
// returns true or false

  function edgeIsCommon (kx, ky, edge) {
    let k;
    switch(edge) {
      case 0 : ky--; break; // top edge
      case 1 : kx++; break; // right edge
      case 2 : ky++; break; // bottom edge
      case 3 : kx--; break; // left edge
    } // switch
    for (k = 0; k < tbCases.length;k++) {
      if (kx == tbCases[k].kx && ky == tbCases[k].ky) return true; // we found the neighbor
    }
    return false; // not a common edge
  } // function edgeIsCommon

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// internal : checks if an edge given by kx, ky is in tbEdges
// return index in tbEdges, or false

  function edgeIsInTbEdges (kx, ky, edge) {
    let k;
    for (k = 0; k < tbEdges.length;k++) {
      if (kx == tbEdges[k].kx && ky == tbEdges[k].ky && edge == tbEdges[k].edge) return k; // found it
    }
    return false; // not found
  } // function edgeIsInTbEdges

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

  let tbLoops = []; // for the result
  let tbEdges = []; // set of edges which are not shared by 2 pieces of input
  let k;
  let kEdge; // to count 4 edges
  let lp; // for loop during its creation
  let currEdge; // current edge
  let tries; // tries counter
  let edgeNumber; // number of edge found during research
  let potNext;

// table of tries

  let tbTries = [
  // if we are on edge 0 (top)
    [
      {dkx: 0, dky: 0, edge: 1}, // try # 0
      {dkx: 1, dky: 0, edge: 0}, // try # 1
      {dkx: 1, dky: -1, edge: 3} // try # 2
    ],
  // if we are on edge 1 (right)
    [
      {dkx: 0, dky: 0, edge: 2},
      {dkx: 0, dky: 1, edge: 1},
      {dkx: 1, dky: 1, edge: 0}
    ],
  // if we are on edge 2 (bottom)
    [
      {dkx: 0, dky: 0, edge: 3},
      {dkx: - 1, dky: 0, edge: 2},
      {dkx: - 1, dky: 1, edge: 1}
    ],
  // if we are on edge 3 (left)
    [
      {dkx: 0, dky: 0, edge: 0},
      {dkx: 0, dky: - 1, edge: 3},
      {dkx: - 1, dky: - 1, edge: 2}
    ],
  ];


// create list of not shared edges (=> belong to boundary)
  for (k = 0;k < tbCases.length;k++) {
    for (kEdge = 0; kEdge < 4; kEdge++) {
      if (!edgeIsCommon(tbCases[k].kx, tbCases[k].ky, kEdge))
           tbEdges.push({kx: tbCases[k].kx, ky: tbCases[k].ky, edge: kEdge, kp: k})
    } // for kEdge
  } // for k

  while (tbEdges.length > 0) {
    lp = []; // new loop
    currEdge = tbEdges[0];   // we begin with first available edge
    lp.push(currEdge);       // add it to loop
    tbEdges.splice(0, 1);    // remove from list of available sides
    do {
      for (tries = 0; tries < 3;tries++) {
        potNext = tbTries[currEdge.edge][tries];
        edgeNumber = edgeIsInTbEdges(currEdge.kx + potNext.dkx, currEdge.ky + potNext.dky, potNext.edge);
        if (edgeNumber === false) continue; // can't here
        // new element in loop
        currEdge = tbEdges[edgeNumber];     // new current edge
        lp.push(currEdge);              // add it to loop
        tbEdges.splice(edgeNumber, 1);  // remove from list of available sides
        break; // stop tries !
      } // for tries
      if (edgeNumber === false) break; // loop is closed
    } while (1); // do-while exited by break
    tbLoops.push(lp); // add this loop to loops list
  } // while tbEdges...
  return tbLoops;
} // function lookForLoops

//---------------------------------------------------------------------------- -

window.addEventListener("load", function(){

let img = 'https://cdn.pixabay.com/photo/2015/09/04/18/55/yoda-922520_960_720.png';

autoStart = isMiniature(); // used for nice miniature in CodePen

let x = new Puzzle ( {img: img,
                      width: window.innerWidth,
                      height: window.innerHeight,
                      idiv: "forPuzzle" });

});