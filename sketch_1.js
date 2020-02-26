class myRectangle{
	constructor(x, y, w, h){
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

		var x1 = this.x;
		var y1 = this.y;
		var x2 = x1 + this.w;
		var y2 = y1;
		var x3 = x1 + this.w;
		var y3 = y1 + this.h;
		var x4 = x1;
		var y4 = y1+this.h;
		var a1 = R.x;
		var b1 = R.y;
		var a2 = a1 + R.w;
		var b2 = b1;
		var a3 = a1 + R.w;
		var b3 = b1 + R.h;
		var a4 = a1;
		var b4 = b1+ R.h;
		console.log(x1,y1, x2,y2, x3,y3, x4,y4);
		console.log(a1,b1, a2,b2, a3,b3, a4,b4);
		if(	inside(a1,b1, x1,y1, x2,y2, x3,y3, x4,y4, eps) ||
		 	inside(a2,b2, x1,y1, x2,y2, x3,y3, x4,y4, eps) ||
		 	inside(a3,b3, x1,y1, x2,y2, x3,y3, x4,y4, eps) ||
		 	inside(a4,b4, x1,y1, x2,y2, x3,y3, x4,y4, eps) ||
		 	inside(x1,y1, a1,b1, a2,b2, a3,b3, a4,b4, eps) ||
		 	inside(x2,y2, a1,b1, a2,b2, a3,b3, a4,b4, eps) ||
		 	inside(x3,y3, a1,b1, a2,b2, a3,b3, a4,b4, eps) ||
		 	inside(x4,y4, a1,b1, a2,b2, a3,b3, a4,b4, eps)
		 )
			return true;
		else
			return false;
	}
}

function inside(px,py, x1,y1, x2,y2, x3,y3, x4,y4, eps) {
	x1-=eps;
	y1-=eps;
	x2+=eps;
	y2-=eps;
	x3+=eps;
	y3+=eps;
	x4-=eps;
	y4+=eps;
	if(x1<px && px<x2 && y1<py && py<y4) return true;
	return false;
}

var WIDTH  = 600;
var HEIGHT = 600;
var totalRect = 20;
var epsilon = 5;
var margin = 20;

var xmin  = margin;
var xmax  = WIDTH  - margin;
var ymin  = margin;
var ymax  = HEIGHT - margin;
var rectangles = []

function setup() {
	createCanvas(WIDTH, HEIGHT);
	background(0, 255 ,0);
}


// function randomRect() {
// 	var x = Math.floor(xlow+ Math.random()*xhigh);
// 	var y = Math.floor(ylow+ Math.random()*yhigh);
// 	var horh = Math.floor(10+ Math.random()*20);
// 	var horw = Math.floor(10+ Math.random()*20);

// 	var verh = Math.floor(10+ Math.random()*20);
// 	var verw = Math.floor(10+ Math.random()*20);
	
// 	fill(0);


// 	dirhor = (Math.random()>0.5);
// 	dirver = (Math.random()>0.5);
	
// 	if(dirhor && dirver)
// 		rect(0, y, x, horh);		// left
// 	else if(dirhor && !dirver)
// 		rect(x, 0, verw, y);	// up
// 	else if(!dirhor && dirver)
// 		rect(x, y, WIDTH-x, horh);		// right
// 	else if(!dirhor && !dirver)
// 		rect(x, y, verw, HEIGHT-y); // down
// }

function getRandomRectangle(eps) {
	while(1){
		var x = Math.floor(xmin+ Math.random()*xmax);
		var y = Math.floor(ymin+ Math.random()*ymax);
		var h = Math.floor(20+ Math.random()*50);
		var w = Math.floor(20+ Math.random()*50);
		R = new myRectangle(x,y,w,h);
		var flag = false;
		for (var i = rectangles.length - 1; i >= 0; i--) {
			if( (x+w)>xmax ||  (y+h)>ymax || R.insersect(rectangles[i], eps)){
				flag = true;
				break;
			}
		}
		console.log("retry");
		console.log(rectangles.length, rectangles[0], R);

		if(flag==false){
			rectangles.push(R);
			R.print();
			break;
		}
	}

}

function draw() {
	var count = 0;
	while(count<totalRect){
		getRandomRectangle(epsilon);
		count+=1;
	}
	noLoop();
	// line(200, 200, x, y);
	// ellipse(x,y,20,20);
	// angle += 0.05;
}