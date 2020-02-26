var WIDTH     = 600; 	// Width of canvas
var HEIGHT    = 600; 	// Height of canvas
var totalRect = 10; 	// Total number of rectangles wanted 
var epsilon   = 5;		// minimum distance between any 2 rectangle
var margin    = 20;		// outer Boundary Margin
var minW      = 20; 	// minimum rectangle Width
var maxW      = 80; 	// maximum rectangle Width
var minH      = 20; 	// minimum rectangle Height
var maxH      = 80; 	// maximum rectangle Height

// -----------------------------------------------------------------
// 					Layout design
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
// ----------------------------------------------------------------
// 					Line Sweep

var segments = [];
var sweepLineStatus = [];

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
	inputN.position(cnv.x + 250,   cnv.y+HEIGHT+70);
}

function resetRectangles(argument) {
	count      = 0;
	rectangles = [];
	segments   = [];
	sweepLineStatus = [];
	console.clear();
	background(0, 255, 0);
	loop();
}

function setup() {
	txt       = createDiv('<H2>Corner Stitching Sweep traversal!</H2>');
	// txt       = createDiv('<H2>Location of maximal empty rectangle!</H2>');

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
	
	getAllSegements();
	sortSegments();
	// removeDuplicates();
	console.log("Removing Duplicates:", segments);
	getdots();
	console.log("Done");
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
	loop();
}


function showHorLine(){
	console.log(rectangles);
	rectangles.sort(function(r1, r2){
		if(r1.x1 < r2.x1) return -1;
		return 0;
	});
	console.log(rectangles);
}


class Segment{
	constructor(x1, y1, x2, y2, R, opening){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.rect = R;
		this.open = opening;
	}
}

function getAllSegements() {
	var x1, y1, x2, y2, S;
	for (var i = rectangles.length - 1; i >= 0; i--) {
		x1 = rectangles[i].x1;
		y1 = rectangles[i].y1;
		x2 = rectangles[i].x2;
		y2 = rectangles[i].y2;
		S  = new Segment(x1, y1, x2, y2, rectangles[i], true);
		segments.push(S);
		
		x1 = rectangles[i].x4;
		y1 = rectangles[i].y4;
		x2 = rectangles[i].x3;
		y2 = rectangles[i].y3;
		S  = new Segment(x1, y1, x2, y2, rectangles[i], false);
		segments.push(S);
	}
}

function sortSegments() {
	console.log("Before sorting:", segments);
	segments.sort(function(s1, s2){
		if(s1.y1 < s2.y1) return -1;
		if(s1.y1 > s2.y1) return 1;
		return 0;
	});
	console.log("After sorting:", segments);
}

function removeDuplicates(argument) {
	var curr, next;
	var result = [];
	if(segments.length<1) return;
	
	result.push(segments[0]);
	var curr;
	for (var i = 1; i < segments.length; i++) {
		curr = segments[i].y1;
		last = result[result.length-1].y1;
		if(curr==last){
			continue;
		}else{
			result.push(segments[i]);
		}
	}
	segments = [];
	segments = result;
	result = [];
}


function flooring(x) { // now in O(N) later have to do in O(logN)
	var ans = -1;
	for (var i = 0; i < sweepLineStatus.length; i++) {
		if(sweepLineStatus[i].x1 < x)
			ans = i;
		else if(sweepLineStatus[i].x1 > x)
			return ans;
		else{ 		// used in deletion
			ans = i;
			return i;
		}
	}
	return ans;
}


function getdots(){
	var index;
	var points = [];
	var temp = [];
	var left, right;
	var isopen;

	fill(0,0,255);
	
	for (var i = 0; i< segments.length; i++) {
		console.log(temp);
		index  = flooring(segments[i].x1);
		isopen = segments[i].open;
		if(isopen){
			if(index == -1){
				// no left exist
				sweepLineStatus.splice(0, 0, segments[i]);
				temp.splice(0, 0, segments[i].x1);
				points.push({x: 0,     y:segments[i].y1});
				
				right = 1;
				if(right == sweepLineStatus.length)
					points.push({x: WIDTH, y:segments[i].y1});
				else
					points.push({x: sweepLineStatus[1].rect.x1, y:segments[i].y1});

				// linedash(0, segments[i].y1, WIDTH, segments[i].y1);
			}
			else{
				sweepLineStatus.splice(index+1, 0, segments[i]);
				temp.splice(index+1, 0, segments[i].x1);
				left  = index; 
				points.push({x:sweepLineStatus[left].rect.x2, y:segments[i].y1});

				right = index + 2;
				if(right == sweepLineStatus.length)
					points.push({x:WIDTH, y:segments[i].y1});
				else
					points.push({x:sweepLineStatus[right].rect.x1, y:segments[i].y1});
			}

			console.log(isopen, index, points[points.length-2], points[points.length-1], temp);

		}else{
			left  = index-1;
			if(left == -1)
				points.push({x:0, y:segments[i].y1});
			else
				points.push({x:sweepLineStatus[left].rect.x2, y:segments[i].y1});
			
			right = index+1; 
			if(right == sweepLineStatus.length)
				points.push({x:WIDTH, y:segments[i].y1});
			else
				points.push({x:sweepLineStatus[right].rect.x1, y:segments[i].y1});
			
			sweepLineStatus.splice(index, 1);
			temp.splice(index, 0);
			console.log(isopen, index, points[points.length-2], points[points.length-1], temp);
		}

		linedash(points[points.length-2].x, points[points.length-2].y, points[points.length-1].x, points[points.length-1].y);
		console.log("h");
		circle(points[points.length-1].x, points[points.length-1].y, 1); 
		circle(points[points.length-2].x, points[points.length-2].y, 1); 
	}

	console.log(points);
	fill(0,0,255);
	for (var i = points.length - 1; i >= 0; i--) {
		circle(points[i].x, points[i].y, 8); 
	}
}



function linedash(x1, y1, x2, y2, delta=2, style = '-') {
	// delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
	let distance = dist(x1,y1,x2,y2);
	let dashNumber = distance/delta;
	let xDelta = (x2-x1)/dashNumber;
	let yDelta = (y2-y1)/dashNumber;

	for (let i = 0; i < dashNumber; i+= 2) {
		let xi1 = i*xDelta + x1;
		let yi1 = i*yDelta + y1;
		let xi2 = (i+1)*xDelta + x1;
		let yi2 = (i+1)*yDelta + y1;

		if (style == '-') { line(xi1, yi1, xi2, yi2); }
		else if (style == '.') { point(xi1, yi1); }
		else if (style == 'o') { ellipse(xi1, yi1, delta/2); }
	}
}