var WIDTH     = 600; 	// Width of canvas
var HEIGHT    = 600; 	// Height of canvas
var totalRect = 40; 	// Total number of rectangles wanted 
var epsilon   = 5;		// minimum distance between any 2 rectangle
var margin    = 20;		// outer Boundary Margin
var minW      = 20; 	// minimum rectangle Width
var maxW      = 80; 	// maximum rectangle Width
var minH      = 20; 	// minimum rectangle Height
var maxH      = 80; 	// maximum rectangle Height

// -----------------------------------------------------------------

var xmin  = margin;                 // min rect.x1
var xmax  = WIDTH  - margin; 		// max rect.x1	
var ymin  = margin;             	// min rect.y1
var ymax  = HEIGHT - margin;      	// max rect.y1
var rectangles = [];
var cnv;
var txt;
var newbtn;
var corbtn;
var hr;
var inputN;
var inputText;
var count = 0;

function windowResized() {
	centerCanvas();
}

function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	txt.position(cnv.x+100, cnv.y-60);
	hr.position(cnv.x, cnv.y+HEIGHT);
	newbtn.position(cnv.x + 10, cnv.y+HEIGHT+10);
	corbtn.position(cnv.x + 10, cnv.y+HEIGHT+40);
	inputText.position(cnv.x + 10, cnv.y+HEIGHT+70);
	inputN.position(cnv.x + 250,    cnv.y+HEIGHT+70);
}

function resetRectangles(argument) {
	count = 0;
	rectangles = [];
	background(0, 255, 0);
	loop();
}

function setup() {
	txt       = createDiv('<H2>Location of maximal empty rectangle!</H2>');
  	cnv       = createCanvas(WIDTH, HEIGHT);
	hr        = createP("<br>");
 	newbtn    = createButton('Reload Rectangles');
 	corbtn    = createButton('Run Corner Stitching');
	inputN    = createInput(totalRect);
	inputText = createDiv("<b>Number of Rectangles (1 to 40): </b>");
	
	newbtn.mousePressed(resetRectangles);
	corbtn.mousePressed(runCornerStitching);
	inputN.input(myInputEvent);

  	cnv.background(0, 255, 0);
	centerCanvas();   
}

function myInputEvent() {
	let temp = this.value();
	if(temp>40 || temp<1){
		window.alert("Please enter the number between 1 and 40. (inclusive)");
		return;
	}

	totalRect = temp;
	console.log('total Rectangles modified to', totalRect);
}


function draw() {
	console.log("Redrawing");
	while(count<totalRect){
		getRandomRectangle(epsilon);
		count+=1;
	}
	// for (var i = rectangles.length - 1; i >= 0; i--) {
	// 	console.log(rectangles[i]);
	// }
	noLoop();
}

class myRectangle{
	constructor(x, y, w, h){
		this.rank = -1;
		this.x1 = x;
		this.y1 = y;
		this.x2 = x + w;
		this.y2 = y;
		this.x3 = x + w;
		this.y3 = y + h;
		this.x4 = x;
		this.y4 = y + h;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	print(){
		fill(255, 0, 0);
		rect(this.x, this.y, this.w, this.h);
	}
	
	insersect(R, eps){
		var x1 = this.x1 - eps;
		var y1 = this.y1 - eps;
		var x3 = this.x3 + eps;
		var y3 = this.y3 + eps;
		var a1 = R.x - eps;
		var b1 = R.y - eps;
		var a3 = R.x + R.w + eps;
		var b3 = R.y + R.h + eps;
		// Rectangles on left or right
	    if (x1 > a3 || a1 > x3) return false; 		  

	    // Rectangles on top or bottom 
	    if (y3 < b1 || b3 < y1) return false; 
	    return true; 
	}
}

function getRandomRectangle(eps) {
	while(1){
		var x = Math.floor(xmin+ Math.random()*xmax);
		var y = Math.floor(ymin+ Math.random()*ymax);
		var h = Math.floor(20+ Math.random()*80);
		var w = Math.floor(20+ Math.random()*80);
		if((x+w)>xmax || (y+h)>ymax) continue;
			
		R = new myRectangle(x,y,w,h);
		var flag = false;
		for (var i = rectangles.length - 1; i >= 0; i--) {
			if( R.insersect(rectangles[i], eps)){
				flag = true;
				break;
			}
		}

		if(flag==false){
			R.rank = rectangles.length +1;
			rectangles.push(R);
			R.print();
			break;
		}
	}
}

function runCornerStitching(){

}