var WIDTH     = 600; 	// Width of canvas
var HEIGHT    = 600; 	// Height of canvas
var totalRect = 20; 	// Total number of rectangles wanted 
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

function setup() {
	createCanvas(WIDTH, HEIGHT);
	background(0, 255 ,0);
}

function draw() {
	var count = 0;
	while(count<totalRect){
		getRandomRectangle(epsilon);
		count+=1;
	}
	for (var i = rectangles.length - 1; i >= 0; i--) {
		console.log(rectangles[i]);
	}
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