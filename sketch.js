var spacing = 10;
var weight = 3;
var lenMin = 3;
var lenMax = 5;
var circSize = 5;
var bgCol = 0;
var fillFreq = 0.5;
var color1, color2;
var myColorMode = "RANDOM";
let img;

var positions = [];

function preload() {
  img = loadImage('assets/image.jpg');
}

function setup() {
  //img.loadPixels();
  createCanvas(img.width, img.height);
  //createCanvas(2880, 1800);
  pixelDensity(4);
  strokeWeight(weight);
  frameRate(1);
  rectMode(CENTER);
  smooth();
  noiseDetail(4, 0.4);
  color1 = color(random(255), random(255), random(255));
  color2 = color(random(255), random(255), random(255));
}

function draw() {
  background(bgCol);
  positions = [];
  noLoop();
  var xSize = -1, ySize = -1;
  for(var x=spacing; x <= width-spacing; x+=spacing){
    xSize++;
    ySize = -1
    positions.push([]);
    for(var y=spacing; y<=height-spacing; y+=spacing){
      ySize++;
      var position = {
        x: x,
        y: y,
        indexX: xSize,
        indexY: ySize,
        photoCol: img.get(x, y),
        available: true
      }
      positions[xSize].push(position);
    }
  }
  for(var i = 0; i < positions.length; i++) {
    var row = positions[i];
    for(var j = 0; j < row.length; j++) {
      var col;
      var len = random(lenMin, lenMax);
      var currentPosition;
      var nextPosition;
      if(positions[i][j].available){
        positions[i][j].available = false;
        currentPosition = positions[i][j];
        col = currentPosition.photoCol;
        fill(0);
        stroke(col);
      }else{
        continue;
      }
      for(var t = 0; t < len; t++){
        nextPosition = validNextPosition(currentPosition.indexX,currentPosition.indexY);
        if(nextPosition == false){
          break;
        }
        line(currentPosition.x, currentPosition.y, nextPosition.x, nextPosition.y);
        currentPosition = nextPosition;
      }
      drawCircle(positions[i][j].x, positions[i][j].y, fillFreq, col);
      drawCircle(currentPosition.x, currentPosition.y, fillFreq, col);
    }
  }
}

function validNextPosition(x, y){
  var validPos = [];
  var setAvail = [];
  var yLen = positions[x].length-1;
  var xLen = positions.length-1;
  if(x>0 && y>0 && positions[x-1][y-1].available){
    validPos.push(positions[x-1][y-1]);
    setAvail.push(0);
  }
  if(y>0  && positions[x][y-1].available){
    validPos.push(positions[x][y-1]);
    setAvail.push(1);
  }
  if(x<xLen && y>0  && positions[x+1][y-1].available){
    validPos.push(positions[x+1][y-1]);
    setAvail.push(2);
  }
  if(x>0 && positions[x-1][y].available){
    validPos.push(positions[x-1][y]);
    setAvail.push(3);
  }
  if(x<xLen && positions[x+1][y].available){
    validPos.push(positions[x+1][y]);
    setAvail.push(4);
  }
  if(x>0 && y<yLen && positions[x-1][y+1].available){
    validPos.push(positions[x-1][y+1]);
    setAvail.push(5);
  }
  if(y<yLen && positions[x][y+1].available){
    validPos.push(positions[x][y+1]);
    setAvail.push(6);
  }
  if(x<xLen && y<yLen && positions[x+1][y+1].available){
    validPos.push(positions[x+1][y+1]);
    setAvail.push(7);
  }
  if(validPos.length == 0){
    return false;
  }
  var randIndex = parseInt(random(0,validPos.length));
  if(setAvail[randIndex] == 0){
    positions[x-1][y-1].available = false;
  }else if(setAvail[randIndex] == 1){
    positions[x][y-1].available = false;
  }else if(setAvail[randIndex] == 2){
    positions[x+1][y-1].available = false;
  }else if(setAvail[randIndex] == 3){
    positions[x-1][y].available = false;
  }else if(setAvail[randIndex] == 4){
    positions[x+1][y].available = false;
  }else if(setAvail[randIndex] == 5){
    positions[x-1][y+1].available = false;
  }else if(setAvail[randIndex] == 6){
    positions[x][y+1].available = false;
  }else if(setAvail[randIndex] == 7){
    positions[x+1][y+1].available = false;
  }
  return (validPos[randIndex]);
}

function drawCircle(x, y, perc, col){
  var tempRand = random(1);
  if(tempRand > perc && tempRand < 0.9){
    push();
    fill(col);
    circle(x, y, circSize);
    pop();
  }else if (tempRand > 0.995){
    if(random(1) > .5){
      push();
      fill(bgCol);
      square(x, y, circSize);
      pop();
    }else{
      push();
      fill(col);
      square(x, y, circSize);
      pop();
    }
  }else{
    push();
    fill(bgCol);
    circle(x, y, circSize);
    pop();
  }
}

function getColor(noiseVal){
  if(myColorMode == "NOISE"){
    return lerpColor(color1, color2, noiseVal);
  }else if(myColorMode == "RANDOM"){
    return color(random(255), random(255), random(255));
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   redraw();
// }

function keyPressed(){
  if(key == ' '){
    color1 = color(random(255), random(255), random(255));
    color2 = color(random(255), random(255), random(255));
    redraw();
  }
}
