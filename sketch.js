var WIDTH     = 600; 	// Width of canvas
var HEIGHT    = 600; 	// Height of canvas
var totalRect = 40; 	// Total number of rectangles wanted 
var epsilon   = 5;		// minimum distance between any 2 rectangle
var margin    = 5;		// outer Boundary Margin
var minW      = 20; 	// minimum rectangle Width
var maxW      = 60; 	// maximum rectangle Width
var minH      = 20; 	// minimum rectangle Height
var maxH      = 60; 	// maximum rectangle Height
var MaxLimit  = 80; 	// maximum permissible rectangles	
var MinLimit  = 1;		// minimum permissible rectangles

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
var intbtn;
var corbtn;
var hr;
var inputN, minHN, minWN, maxWN, maxHN;
var inputText;
var allBlocks;
var resultText;
var count = 0;
var circleRadius = 8;
var part1 = false;
var part2 = false;
var done = false;

// ----------------------------------------------------------------
// 					Line Sweep

var segments = [];
var sweepLineStatus = [];
var emptyBlocks = [];
var linesegments = [];
var points = [];

function windowResized() {
	centerCanvas();
}

function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = ((windowHeight - height) / 2) - 30;
	cnv.position(x, y);
	txt.position(cnv.x+100, cnv.y-60);
	hr.position(cnv.x, cnv.y+HEIGHT);
	newbtn.position(20, 100);
	intbtn.position(20, 130);
	corbtn.position(20, 160);
	inputText.position(20,  190);
	inputN.position(20+230, 190);
	minWN.position(20+230, 190+37);
	maxWN.position(20+230, 190+71);
	minHN.position(20+230, 190+110);
	maxHN.position(20+230, 190+145);

    allBlocks.position(cnv.x+WIDTH + 50, 50);
	resultText.position(cnv.x, cnv.y+HEIGHT);
}

function btn_resetRectangles(argument) {
	count      = 0;
	rectangles = [];
	segments   = [];
	sweepLineStatus = [];
	emptyBlocks = [];
	linesegments = [];
	points = [];
	done  = false;
	part1 = false;
	part2 = false;
	resultText.html("<h2>Results:</h2><br>");
	allBlocks.html("<h3>List of all Empty Blocks:</h3><br>");
	console.clear();
	background(0, 255, 0);
	loop();
}
function btn_getIntersections(){
	if(!part1){
		fill(0,0,255);
		for (var i = linesegments.length - 1; i >= 0; i--) {
			linedash(linesegments[i].x1, linesegments[i].y1, linesegments[i].x2, linesegments[i].y2);		
		}
	
		for (var i = points.length - 1; i >= 0; i--) {
			circle(points[i].x, points[i].y, circleRadius); 
		}
		part1 = true;
	}
	loop();
}
function btn_runCornerStitching(){
	if(!part2){
		for (var i = emptyBlocks.length - 1; i >= 0; i--) {
			fill(255,204,0);
			rect(emptyBlocks[i].x1+1, emptyBlocks[i].y1+1, emptyBlocks[i].w-2, emptyBlocks[i].h-2); 
			fill(0);
			text(emptyBlocks[i].rank, emptyBlocks[i].x1 + 5, emptyBlocks[i].y1 + 15);
		}

		fill(0,0,255);
		for (var i = points.length - 1; i >= 0; i--) {
			circle(points[i].x, points[i].y, circleRadius); 
		}		
		part2 = true;

		var answer = 0;
		let temp, temp2; 
		for (var i = emptyBlocks.length - 1; i >= 0; i--) {
			temp = (emptyBlocks[i].w * emptyBlocks[i].h);
			if(answer < temp){	
				answer = temp;
			}
		}

		for (var i = emptyBlocks.length - 1; i >= 0; i--) {
			temp2 = (emptyBlocks[i].w * emptyBlocks[i].h);
			if(answer == temp2){	
				fill(155, 200, 25);
				rect(emptyBlocks[i].x1+1, emptyBlocks[i].y1+1, emptyBlocks[i].w-2, emptyBlocks[i].h-2);
				fill(0);
				text(emptyBlocks[i].rank, emptyBlocks[i].x1 + 5, emptyBlocks[i].y1 + 15);
			}
		}
		printResult(answer);
	}
	loop();
}

function setup() {
	txt       = createDiv('<H2>Corner Stitching Sweep traversal!</H2>');
	// txt       = createDiv('<H2>Location of maximal empty rectangle!</H2>');

  	cnv       = createCanvas(WIDTH, HEIGHT);
	hr        = createP("<br>");
 	newbtn    = createButton('Reload Rectangles');
 	intbtn    = createButton('Get Intersection Points');
 	corbtn    = createButton('Run Corner Stitching');
	inputN    = createInput(totalRect);
	
	minWN     = createInput(minW);
	maxWN     = createInput(maxW);
	minHN     = createInput(minH);
	maxHN     = createInput(maxH);

	inputText = createDiv("<b>Number of Rectangles (" +MinLimit+" to "+MaxLimit+"):<br><br>Min Rectangle Width (" +MinLimit+" to "+MaxLimit+"):<br><br>Max Rectangle Width (" +MinLimit+" to "+MaxLimit+"):<br><br>Min Rectangle Height (" +MinLimit+" to "+MaxLimit+"):<br><br>Max Rectangle Height (" +MinLimit+" to "+MaxLimit+"):</b><br>");
	
	newbtn.mousePressed(btn_resetRectangles);
	intbtn.mousePressed(btn_getIntersections);
	corbtn.mousePressed(btn_runCornerStitching);
	
	inputN.input(myInputEvent);
	minWN.input(myInputEvent);
	maxWN.input(myInputEvent);
	minHN.input(myInputEvent);
	maxHN.input(myInputEvent);


	allBlocks  = createDiv("<h3>List of all Empty Blocks:</h3>");
	resultText = createP("<h2>Results:</h2><br>");


  	cnv.background(0, 255, 0);
	centerCanvas();
}

function myInputEvent() {
	let temp = this.value();
	if(temp>MaxLimit || temp<MinLimit){
		window.alert("Please enter the number between " +MinLimit+" and "+MaxLimit+". (inclusive)");
		return;
	}
	minW = minWN.value();
	maxW = maxWN.value();
	minH = minHN.value();
	maxH = maxHN.value();
	totalRect = inputN.value();
	console.log('total Rectangles modified to', totalRect);
	console.log(inputN.value(), minWN.value(), maxWN.value(), minHN.value(), maxHN.value());
	
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
function showHorLine(){
	console.log(rectangles);
	rectangles.sort(function(r1, r2){
		if(r1.x1 < r2.x1) return -1;
		return 0;
	});
	console.log(rectangles);
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
function sortRectangles(){
	rectangles.sort(function(r1, r2){
		if(r1.y1 < r2.y1) return -1;
		if(r1.y1 > r2.y1) return 1;
		return 0;
	});
	for (var i = 0; i < rectangles.length; i++) {
		rectangles[i].rank = i+1;
		fill(0);
		text(i+1, rectangles[i].x1 + 5, rectangles[i].y1 + 15);
	}
}
function sortSegments() {
	// console.log("Before sorting:", segments);
	segments.sort(function(s1, s2){
		if(s1.y1 < s2.y1) return -1;
		if(s1.y1 > s2.y1) return 1;
		return 0;
	});
	// console.log("After sorting:", segments);
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
function printResult(ans){
	var str="<h3>List of all Empty Blocks:</h3><table><tr><th>Block #</th><th>W</th><th>H</th><th>Area</th></tr>";
	var final="";
	var temp;
	console.log("ans:",ans);
	for (var i = 0; i < emptyBlocks.length; i++) {
		temp = (emptyBlocks[i].w*emptyBlocks[i].h);
		if(temp == ans)
			final+=("B "+emptyBlocks[i].rank+ ") Width = "+ emptyBlocks[i].w+ " Height = " + emptyBlocks[i].h + "&nbsp;&nbsp; Area:"+(emptyBlocks[i].w*emptyBlocks[i].h) + "<br>");
	
		str+=(  "<tr><td>"+emptyBlocks[i].rank+"</td><td>"+ emptyBlocks[i].w + "</td><td>" + emptyBlocks[i].h + "</td><td>" + (emptyBlocks[i].w*emptyBlocks[i].h) + "</td></tr>");
	}
	str+="</table>";

    allBlocks.html(str);
	resultText.html("<h2>Results:</h2><br>" + final);
	// console.log("here", final);
}
function draw() {
	while(count<totalRect){
		getRandomRectangle(epsilon);
		count+=1;
		if(count==totalRect)
			sortRectangles();
	}

	if(!done){
		getAllSegements();
		sortSegments();
		getdots();		
		console.log("Done", emptyBlocks);
		done = true;		
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
		this.up    = [];
		this.down  = [];
		this.left  = [];
		this.right = [];
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

class Segment{
	constructor(x1, y1, x2, y2, R, opening){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.rect = R;
		this.open = opening;
		this.up    = [];
		this.down  = [];
		this.left  = [];
		this.right = [];
	}
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
	var temp = [];
	var left, right;
	var isopen;
	var openlines = [];
	var closeLeft_left;
	var closeLeft_right;
	var closeRight_left;
	var closeRight_right;
	var R1, R2;
	openlines.push({x1:0, y1:0, x2:WIDTH, y2:0});

	for (var i = 0; i< segments.length; i++) {
		index  = flooring(segments[i].x1);
		isopen = segments[i].open;
		if(isopen){						// rectangle opening 
			if(index == -1){
														// no left exist
				sweepLineStatus.splice(0, 0, segments[i]);
				temp.splice(0, 0, segments[i].x1);
				points.push({x: 0,     y:segments[i].y1});
				R1 = null;

				right = 1;
				if(right == sweepLineStatus.length)		// no right exist
					{points.push({x: WIDTH, y:segments[i].y1}); R2 = null;}
				else 									// right exist
					{points.push({x: sweepLineStatus[1].rect.x1, y:segments[i].y1}); R2 = sweepLineStatus[1].rect;}
			}
			else{
				sweepLineStatus.splice(index+1, 0, segments[i]);
				temp.splice(index+1, 0, segments[i].x1);
				left  = index; 
				points.push({x:sweepLineStatus[left].rect.x2, y:segments[i].y1});
				R1 = sweepLineStatus[left].rect;

				right = index + 2;
				if(right == sweepLineStatus.length)
					{points.push({x:WIDTH, y:segments[i].y1}); R2 = null;}
				else
					{points.push({x:sweepLineStatus[right].rect.x1, y:segments[i].y1}); R2 = sweepLineStatus[right].rect;}
			}

			checkPossibleEmptyBlocks1(openlines, points[points.length-2].x, points[points.length-2].y, points[points.length-1].x, points[points.length-1].y, R1, R2);			
			openlines.push({x1:points[points.length-2].x, y1:points[points.length-2].y, x2:segments[i].x1,            y2:segments[i].y1});
			openlines.push({x1:segments[i].x2,            y1:segments[i].y2,            x2:points[points.length-1].x, y2:points[points.length-1].y});
		}else{						// rectangle closing
			left  = index-1;
			if(left == -1)
				{points.push({x:0, y:segments[i].y1});  closeLeft_left= null;}
			else
				{points.push({x:sweepLineStatus[left].rect.x2, y:segments[i].y1}); closeLeft_left = sweepLineStatus[left].rect;}
			

			right = index+1; 
			if(right == sweepLineStatus.length)
				{points.push({x:WIDTH, y:segments[i].y1}); closeRight_right = null;}
			else
				{points.push({x:sweepLineStatus[right].rect.x1, y:segments[i].y1}); closeRight_right = sweepLineStatus[right].rect;}
			
			sweepLineStatus.splice(index, 1);
			temp.splice(index, 1);

			closeLeft_right = segments[i].rect;
			closeRight_left = segments[i].rect;
			if((segments[i].x1 - points[points.length-2].x) >0)
				checkPossibleEmptyBlocks2(openlines, points[points.length-2].x, points[points.length-2].y, segments[i].x1, segments[i].y1, closeLeft_left, closeLeft_right);
			if((points[points.length-1].x - segments[i].x2) >0)
				checkPossibleEmptyBlocks2(openlines, segments[i].x2, segments[i].y2, points[points.length-1].x, points[points.length-1].y, closeRight_left, closeRight_right);			
			
			openlines.push({x1:points[points.length-2].x, y1:points[points.length-2].y, x2:points[points.length-1].x, y2:points[points.length-1].y});
		}
		// console.log("After ", i, emptyBlocks.length, emptyBlocks, openlines);

		linesegments.push({x1:points[points.length-2].x, y1:points[points.length-2].y, x2:points[points.length-1].x, y2:points[points.length-1].y });
		// linedash(points[points.length-2].x, points[points.length-2].y, points[points.length-1].x, points[points.length-1].y);
		// console.log(isopen, index, points[points.length-2], points[points.length-1], temp);
		// circle(points[points.length-1].x, points[points.length-1].y, 8); 
		// circle(points[points.length-2].x, points[points.length-2].y, 8); 
	}

	// console.log("here", linesegments);
	var x1, y1, x2, y2;
	x1 = openlines[openlines.length-1].x1;
	y1 = openlines[openlines.length-1].y1;
	x2 = openlines[openlines.length-1].x2;
	y2 = openlines[openlines.length-1].y2;

	emptyBlocks.push({up:null, down:null, left:null, right:null, x1: x1, y1: y1, w:WIDTH , h:(HEIGHT-y2), rank:(emptyBlocks.length+1)});

	// console.log(points);
}




function checkPossibleEmptyBlocks1(openlines, px1, py1, px2, py2, R1, R2){
	var x1, y1, x2, y2, flag=0, UP, DOWN, LEFT, RIGHT;
	for (var i = 0; i < openlines.length; i++) {
		x1 = openlines[i].x1;
		y1 = openlines[i].y1;
		x2 = openlines[i].x2;
		y2 = openlines[i].y2;

		if(x1==px1 && x2==px2){
			flag +=1;
			if((x2-x1)*(py2-y2) !=0)
			{	UP    = null;
				DOWN  = null;
				LEFT  = (R1==null)?null:R1.rank;
				RIGHT = (R2==null)?null:R2.rank;
				emptyBlocks.push({up:UP, down:DOWN, left:LEFT, right:RIGHT, x1: x1, y1: y1, w:(x2-x1) , h:(py2-y2), rank:(emptyBlocks.length+1)});				
			}
			// console.log("block found", emptyBlocks.length, emptyBlocks);
			openlines.splice(i, 1);
		}
		if(flag>1){
			console.log("Error", emptyBlocks);
		}
	}
}

function checkPossibleEmptyBlocks2(openlines, px1, py1, px2, py2, R1, R2){
	var x1, y1, x2, y2, flag=0, UP, DOWN, LEFT, RIGHT;
	for (var i = 0; i < openlines.length; i++) {
		x1 = openlines[i].x1;
		y1 = openlines[i].y1;
		x2 = openlines[i].x2;
		y2 = openlines[i].y2;

		if(x1==px1 && x2==px2){
			flag +=1; 
			if((x2-x1)*(py2-y2) !=0)
			{	UP    = null;
				DOWN  = null;
				LEFT  = (R1==null)?null:R1.rank;
				RIGHT = (R2==null)?null:R2.rank;
				emptyBlocks.push({up:UP, down:DOWN, left:LEFT, right:RIGHT, x1: x1, y1: y1, w:(x2-x1) , h:(py2-y2), rank:(emptyBlocks.length+1)});
			}
			openlines.splice(i, 1);
			// console.log("block found", emptyBlocks.length);
			return;
		}
		if(flag>1){
			console.log("Error", emptyBlocks);
		}
	}
}


