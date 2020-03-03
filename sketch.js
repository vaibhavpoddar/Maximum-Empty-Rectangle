var WIDTH     = 600; 	// Width of canvas
var HEIGHT    = 600; 	// Height of canvas
var totalRect = 20; 	// Total number of rectangles wanted 
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
var cnv;
var txt;

var newbtn;
var horbtn;
var corbtn;
var resbtn;
var clrbtn;
var verbtn;
var corbtn2;
var resbtn2;

var hr;
var inputN, minHN, minWN, maxWN, maxHN;
var inputText;
var allBlocks;
var resultText, resultText2;
var textCB, textCB2;
var showText = false, showText2 = false;
var count = 0;
var circleRadius = 8;
var part1 = false;
var part2 = false;
var done = false;

// ----------------------------------------------------------------
// 					Line Sweep
var rectangles = [];
var segments = [];
var sweepLineStatus = [];
var emptyBlocks = [];
var linesegments = [];
var points = [];
var openlines = [];
var ans_Coordinates = [];

var rectangles2 = [];
var segments2 = [];
var sweepLineStatus2 = [];
var emptyBlocks2 = [];
var linesegments2 = [];
var points2 = [];
var openlines2 = [];
var ans_Coordinates2 = [];
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
function windowResized() {
	centerCanvas();
}
function centerCanvas() {
	var x = ((windowWidth - width) / 2 ) -60;
	var y = ((windowHeight - height) / 2) - 50;
	cnv.position(x, y);
	txt.position(cnv.x+30, cnv.y-60);
	hr.position(cnv.x, cnv.y+HEIGHT);
	
	textCB.position(5, 15);
	textCB2.position(5, 35);

	newbtn.position(20, 70);
	
	horbtn.position(20, 130);
	corbtn.position(20, 160);
	resbtn.position(20, 190);

	clrbtn.position(20, 250);

	verbtn.position(20,  310);
	corbtn2.position(20, 340);
	resbtn2.position(20, 370);

	let temp3 = 450;
	inputText.position(20,  temp3);
	inputN.position(20+230, temp3);
	minWN.position(20+230, temp3+37);
	maxWN.position(20+230, temp3+71);
	minHN.position(20+230, temp3+110);
	maxHN.position(20+230, temp3+145);

    allBlocks.position(cnv.x+WIDTH + 50, 50);
	resultText.position(20, cnv.y+HEIGHT-20);
	resultText2.position(450,cnv.y+HEIGHT-20);
}
function btn_clearAll(){
	if(1){
	  	cnv.background(0, 255, 0);
		for (var i = rectangles.length - 1; i >= 0; i--) {
			rectangles[i].print();
		}
	}
	loop();
}
function btn_resetRectangles(argument) {
	count      = 0;
	rectangles = [];
	segments   = [];
	sweepLineStatus = [];
	emptyBlocks = [];
	linesegments = [];
	points = [];
	openlines = [];
	ans_Coordinates = [];

	rectangles2 = [];
	segments2   = [];
	sweepLineStatus2 = [];
	emptyBlocks2 = [];
	linesegments2 = [];
	points2 = [];
	openlines2 = [];
	ans_Coordinates2 = [];
	
	done  = false;
	part1 = false;
	part2 = false;
	resultText.html("");
	resultText2.html("");
	allBlocks.html("");
	console.clear();
	background(0, 255, 0);
	loop();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function btn_getIntersections(){
	if(1){
		fill(0,0,255);
		for (var i = linesegments.length - 1; i >= 0; i--) {
			linedash(linesegments[i].x1, linesegments[i].y1, linesegments[i].x2, linesegments[i].y2);		
		}

		for (var i = points.length - 1; i >= 0; i--) {
			circle(points[i].x, points[i].y, circleRadius); 
		}
	}
	loop();
}
function btn_getIntersections2(){
	if(1){
		fill(0,0,255);
		for (var i = linesegments2.length - 1; i >= 0; i--) {
			linedash(linesegments2[i].x1, linesegments2[i].y1, linesegments2[i].x2, linesegments2[i].y2);		
		}
	
		for (var i = points2.length - 1; i >= 0; i--) {
			circle(points2[i].x, points2[i].y, circleRadius); 
		}
	}
	loop();
}
function btn_runCornerStitching(){
	if(1){
		for (var i = emptyBlocks.length - 1; i >= 0; i--) {
			fill(255,204,0);
			rect(emptyBlocks[i].x1+1, emptyBlocks[i].y1+1, emptyBlocks[i].w-2, emptyBlocks[i].h-2); 
			fill(0);
			if(showText)
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
				if(showText)
					text(emptyBlocks[i].rank, emptyBlocks[i].x1 + 5, emptyBlocks[i].y1 + 15);
			}
		}
		// printResult(answer, null);
	}
	loop();
}
function btn_runCornerStitching2(){
	if(1){
		for (var i = emptyBlocks2.length - 1; i >= 0; i--) {
			fill(255,204,0);
			console.log("printing", emptyBlocks2[i].x1+1, emptyBlocks2[i].y1+1, emptyBlocks2[i].w-2, emptyBlocks2[i].h-2);
			rect(emptyBlocks2[i].x1+1, emptyBlocks2[i].y1+1, emptyBlocks2[i].w-2, emptyBlocks2[i].h-2); 
			fill(0);
			if(showText2)
				text(emptyBlocks2[i].rank, emptyBlocks2[i].x1 + 5, emptyBlocks2[i].y1 + 15);
		}

		fill(0,0,255);
		for (var i = points2.length - 1; i >= 0; i--) {
			circle(points2[i].x, points2[i].y, circleRadius); 
		}		
		// part2 = true;

		var answer = 0;
		let temp, temp2; 
		for (var i = emptyBlocks2.length - 1; i >= 0; i--) {
			temp = (emptyBlocks2[i].w * emptyBlocks2[i].h);
			if(answer < temp){
				answer = temp;
			}
		}

		for (var i = emptyBlocks2.length - 1; i >= 0; i--) {
			temp2 = (emptyBlocks2[i].w * emptyBlocks2[i].h);
			if(answer == temp2){	
				fill(155, 200, 25);
				rect(emptyBlocks2[i].x1+1, emptyBlocks2[i].y1+1, emptyBlocks2[i].w-2, emptyBlocks2[i].h-2);
				fill(0);
				if(showText2)
					text(emptyBlocks2[i].rank, emptyBlocks2[i].x1 + 5, emptyBlocks2[i].y1 + 15);
			}
		}
		// printResult2(answer, null);
	}
	loop();
}
function btn_getResult(){
	if(1){
		var answer = 0;
		let temp, temp2; 
		for (var i = emptyBlocks.length - 1; i >= 0; i--) {
			temp = (emptyBlocks[i].w * emptyBlocks[i].h);
			if(answer < temp){	
				answer = temp;
			}
		}

		console.log("Result:", ans_Coordinates);
		fill(0, 0, 200, 150); 
		for (var i = 0; i < ans_Coordinates.length; i++) {
			rect(ans_Coordinates[i].x1, ans_Coordinates[i].y1, ans_Coordinates[i].w, ans_Coordinates[i].h);
		}

		if(ans_Coordinates.length>0)
			printResult(answer, ans_Coordinates[0].area);
		else
			printResult(answer, null);
	}
	loop();
}
function btn_getResult2(){
	if(1){
		var answer = 0;
		let temp, temp2; 
		for (var i = emptyBlocks2.length - 1; i >= 0; i--) {
			temp = (emptyBlocks2[i].w * emptyBlocks2[i].h);
			if(answer < temp){	
				answer = temp;
			}
		}

		console.log("Result:", ans_Coordinates2);
		fill(0, 0, 200, 150); 
		for (var i = 0; i < ans_Coordinates2.length; i++) {
			rect(ans_Coordinates2[i].x1, ans_Coordinates2[i].y1, ans_Coordinates2[i].w, ans_Coordinates2[i].h);
		}

		if(ans_Coordinates2.length>0)
			printResult2(answer, ans_Coordinates2[0].area);
		else
			printResult2(answer, null);
	}
	loop();
}
function myCheckBoxEvent(){
	if(this.checked()){
		showText = true;
	}else{
		showText = false;
	}
}
function myCheckBoxEvent2(){
	if(this.checked()){
		showText2 = true;
	}else{
		showText2 = false;
	}
}
function myInputEvent() {
	let temp = this.value();
	if(temp>MaxLimit || temp<MinLimit){
		window.alert("Please enter the number between " +MinLimit+" and "+MaxLimit+". (inclusive)");
		return;
	}
	minW = (int)(minWN.value());
	maxW = (int)(maxWN.value());
	minH = (int)(minHN.value());
	maxH = (int)(maxHN.value());
	totalRect = (int)(inputN.value());
	console.log("New values:", totalRect, inputN.value(), minWN.value(), maxWN.value(), minHN.value(), maxHN.value());
}
function getRandomRectangle(eps) {
	while(1){
		var x = Math.floor(xmin+ Math.random()*(xmax));
		var y = Math.floor(ymin+ Math.random()*(ymax));
		var h = Math.floor(minH+ Math.random()*(maxH-minH));
		var w = Math.floor(minW+ Math.random()*(maxW-minW));
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
			rectangles2.push(new myRectangle(x,y,w,h));
			R.print();
			break;
		}
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
function getAllSegements2() {
	var x1, y1, x2, y2, S;
	for (var i = rectangles2.length - 1; i >= 0; i--) {
		x1 = rectangles2[i].x1;
		y1 = rectangles2[i].y1;
		x2 = rectangles2[i].x4;
		y2 = rectangles2[i].y4;
		S  = new Segment(x1, y1, x2, y2, rectangles2[i], true);
		segments2.push(S);
		
		x1 = rectangles2[i].x2;
		y1 = rectangles2[i].y2;
		x2 = rectangles2[i].x3;
		y2 = rectangles2[i].y3;
		S  = new Segment(x1, y1, x2, y2, rectangles2[i], false);
		segments2.push(S);
	}
	// console.log("All segments2:", segments2);
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
		if(showText)
			text(i+1, rectangles[i].x1 + 5, rectangles[i].y1 + 15);
	}
}
function sortRectangles2(){
	rectangles2.sort(function(r1, r2){
		if(r1.x1 < r2.x1) return -1;
		if(r1.x1 > r2.x1) return 1;
		return 0;
	});
	for (var i = 0; i < rectangles2.length; i++) {
		rectangles2[i].rank = i+1;
		fill(0);
		if(showText2)
			text(i+1, rectangles2[i].x1 + 5, rectangles2[i].y1 + 15);
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
function sortSegments2() {
	// console.log("Before sorting:", segments);
	segments2.sort(function(s1, s2){
		if(s1.x1 < s2.x1) return -1;
		if(s1.x1 > s2.x1) return 1;
		return 0;
	});
	// console.log("After sorting:", segments);
}

function printResult(ans, ActualMax=null){
	var eB    = emptyBlocks;
	eB.sort(function(b1, b2){
		if(b1.w*b1.h > b2.w*b2.h) return -1;
		if(b1.w*b1.h < b2.w*b2.h) return 1;
		return 0;
	});

	var temp;
	var str   = "<h3>Horizontal) List of all Empty Blocks:</h3><table><tr><th>Block #</th><th>W</th><th>H</th><th>Area</th></tr>";
	for (var i = 0; i < eB.length; i++) {
		temp = (eB[i].w * eB[i].h);
		if(temp == ans)
			str+=("<tr style='font-weight:bold'><td>"+eB[i].rank+ "</td><td>"+ eB[i].w+ "</td><td>" + eB[i].h + "</td><td>" + (eB[i].w*eB[i].h) + "</td></tr>");	
		else
			str+=(  "<tr><td>"+eB[i].rank+ "</td><td>"+ eB[i].w+ "</td><td>" + eB[i].h + "</td><td>" + (eB[i].w*eB[i].h) + "</td></tr>");	
	}
	str+="</table>";

    allBlocks.html(str);
    var final="";
	if(ActualMax != null){
		final += "<table><tr><th>X</th><th>Y</th><th>W</th><th>H</th><th>Area</th></tr>";
		for (var i = 0; i < ans_Coordinates.length; i++) {
			final += "<tr><td>"+ans_Coordinates[i].x1+"</td><td>"+ ans_Coordinates[i].y1 + "</td><td>" + ans_Coordinates[i].w + "</td><td>" + ans_Coordinates[i].h + "</td><td>" + ans_Coordinates[i].area + "</td></tr>"
		}
		final += "</table>";
	}
	resultText.html("<h2>(Result) MER by Horizontal Partition:</h2>" + final);
}

function printResult2(ans, ActualMax=null){
	var eB    = emptyBlocks2;
	eB.sort(function(b1, b2){
		if(b1.w*b1.h > b2.w*b2.h) return -1;
		if(b1.w*b1.h < b2.w*b2.h) return 1;
		return 0;
	});

	var temp;
	var str   = "<h3>Vertical) List of all Empty Blocks:</h3><table><tr><th>Block #</th><th>W</th><th>H</th><th>Area</th></tr>";
	for (var i = 0; i < eB.length; i++) {
		temp = (eB[i].w * eB[i].h);
		if(temp == ans)
			str+=("<tr style='font-weight:bold'><td>"+eB[i].rank+ "</td><td>"+ eB[i].w+ "</td><td>" + eB[i].h + "</td><td>" + (eB[i].w*eB[i].h) + "</td></tr>");	
		else
			str+=(  "<tr><td>"+eB[i].rank+ "</td><td>"+ eB[i].w+ "</td><td>" + eB[i].h + "</td><td>" + (eB[i].w*eB[i].h) + "</td></tr>");	
	}
	str+="</table>";

    allBlocks.html(str);
    var final="";
	if(ActualMax != null){
		final += "<table><tr><th>X</th><th>Y</th><th>W</th><th>H</th><th>Area</th></tr>";
		for (var i = 0; i < ans_Coordinates2.length; i++) {
			final += "<tr><td>"+ans_Coordinates2[i].x1+"</td><td>"+ ans_Coordinates2[i].y1 + "</td><td>" + ans_Coordinates2[i].w + "</td><td>" + ans_Coordinates2[i].h + "</td><td>" + ans_Coordinates2[i].area + "</td></tr>"
		}
		final += "</table>";
	}
	resultText2.html("<h2>(Result) MER by Vertical Partition:</h2>" + final);
	// return final; 
}
function getResult(){
	// for (var i = 0; i < emptyBlocks.length; i++) {
	// 	console.log("rank:",emptyBlocks[i].rank,"up:",emptyBlocks[i].up,"down:",emptyBlocks[i].down); 
	// }
	var ans_area=0, ans_rank=0;
	var temp_area, temp_rank;
	var areas = [];
	for (var i = 0; i < emptyBlocks.length; i++) {
		areas.push({rank: emptyBlocks[i].rank, res: get_max_Area(emptyBlocks[i].rank)});
	}
	var max_area = 0;
	for (var i = 0; i < areas.length; i++) {
		max_area = max(max_area, areas[i].res.area);
	}

	for (var i = 0; i < areas.length; i++) {
		if(areas[i].res.area == max_area){
			ans_Coordinates.push(areas[i].res);
		}
	}
}
function getResult2(){
	// for (var i = 0; i < emptyBlocks.length; i++) {
	// 	console.log("rank:",emptyBlocks[i].rank,"up:",emptyBlocks[i].up,"down:",emptyBlocks[i].down); 
	// }
	var ans_area=0, ans_rank=0;
	var temp_area, temp_rank;
	var areas = [];
	for (var i = 0; i < emptyBlocks2.length; i++) {
		areas.push({rank: emptyBlocks2[i].rank, res: get_max_Area2(emptyBlocks2[i].rank)});
	}
	var max_area = 0;
	for (var i = 0; i < areas.length; i++) {
		max_area = max(max_area, areas[i].res.area);
	}

	for (var i = 0; i < areas.length; i++) {
		if(areas[i].res.area == max_area){
			ans_Coordinates2.push(areas[i].res);
		}
	}
}
// ----------------------------------------------------------------
function setup() {
	txt       = createDiv('<H2>Maximum Empty Rectangle in VLSI Layout Design!</H2>');

  	cnv       = createCanvas(WIDTH, HEIGHT);
	hr        = createP("<br>");
 	newbtn    = createButton('NEW RECTANGLES');
 	horbtn    = createButton('Horizontal Partition');
 	corbtn    = createButton('Corner Stitching Horizontal');
	resbtn    = createButton('Corner Stitching Horizontal Results');
	clrbtn    = createButton('Clean BOARD');
	verbtn    = createButton('Vertical Partition');
	corbtn2   = createButton('Corner Stitching Vertical');
	resbtn2   = createButton('Corner Stitching Vertical Results');
	
	textCB    = createCheckbox('Display Horizontal numbering', false);
	textCB2   = createCheckbox('Display Vertical numbering', false);

	inputN    = createInput(totalRect);
	minWN     = createInput(minW);
	maxWN     = createInput(maxW);
	minHN     = createInput(minH);
	maxHN     = createInput(maxH);

	inputText = createDiv("<b>Number of Rectangles (" +MinLimit+" to "+MaxLimit+"):<br><br>Min Rectangle Width (" +MinLimit+" to "+MaxLimit+"):<br><br>Max Rectangle Width (" +MinLimit+" to "+MaxLimit+"):<br><br>Min Rectangle Height (" +MinLimit+" to "+MaxLimit+"):<br><br>Max Rectangle Height (" +MinLimit+" to "+MaxLimit+"):</b><br>");
	
	newbtn.mousePressed(btn_resetRectangles);
	horbtn.mousePressed(btn_getIntersections);
	corbtn.mousePressed(btn_runCornerStitching);
	resbtn.mousePressed(btn_getResult);
	clrbtn.mousePressed(btn_clearAll);
	verbtn.mousePressed(btn_getIntersections2);
	corbtn2.mousePressed(btn_runCornerStitching2);
	resbtn2.mousePressed(btn_getResult2);
	
	textCB.changed(myCheckBoxEvent);
	textCB2.changed(myCheckBoxEvent2);

	inputN.input(myInputEvent);
	minWN.input(myInputEvent);
	maxWN.input(myInputEvent);
	minHN.input(myInputEvent);
	maxHN.input(myInputEvent);

	allBlocks   = createDiv("");
	resultText  = createP("");
	resultText2 = createP("");
  	
  	cnv.background(0, 255, 0);
	centerCanvas();
}
function draw() {
	while(count<totalRect){
		getRandomRectangle(epsilon);
		count+=1;
		if(count==totalRect)
			{sortRectangles(); sortRectangles2();}
	}
	if(!done){
		getAllSegements();
		getAllSegements2();
		sortSegments();
		sortSegments2();
		getdots();		
		getdots2();
		getResult();
		getResult2();
		console.log("EmptyBlocks:",  emptyBlocks);
		console.log("EmptyBlocks2:", emptyBlocks);
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

function flooring(x) {
	var ans = -1;
	for (var i = 0; i < sweepLineStatus.length; i++) {
		if(sweepLineStatus[i].x1 < x)
			ans = i;
		else if(sweepLineStatus[i].x1 > x)
			return ans;
		else{
			ans = i;
			return i;
		}
	}
	return ans;
}
function flooring2(y) {
	var ans = -1;
	for (var i = 0; i < sweepLineStatus2.length; i++) {
		if(sweepLineStatus2[i].y1 < y)
			ans = i;
		else if(sweepLineStatus2[i].y1 > y)
			return ans;
		else{
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
	var closeLeft_left;
	var closeLeft_right;
	var closeRight_left;
	var closeRight_right;
	var R1, R2, t1, t2, r, pointer;
	openlines = [];
	openlines.push({x1:0, y1:0, x2:WIDTH, y2:0, up:[]});

	for (var i = 0; i< segments.length; i++) {
		index  = flooring(segments[i].x1);
		isopen = segments[i].open;
		if(isopen){					// rectangle opening 
			if(index == -1){		// no left exist
				sweepLineStatus.splice(0, 0, segments[i]);
				// console.log("here",segments[i]);
				// temp.splice(0, 0, segments[i].x1);
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
				// temp.splice(index+1, 0, segments[i].x1);
				left  = index; 
				points.push({x:sweepLineStatus[left].rect.x2, y:segments[i].y1});
				R1 = sweepLineStatus[left].rect;

				right = index + 2;
				if(right == sweepLineStatus.length)
					{points.push({x:WIDTH, y:segments[i].y1}); R2 = null;}
				else
					{points.push({x:sweepLineStatus[right].rect.x1, y:segments[i].y1}); R2 = sweepLineStatus[right].rect;}
			}

			t1 = checkPossibleEmptyBlocks(points[points.length-2].x, points[points.length-2].y, points[points.length-1].x, points[points.length-1].y, R1, R2);			
			openlines.push({x1:points[points.length-2].x, y1:points[points.length-2].y, x2:segments[i].x1,            y2:segments[i].y1,            up:[t1]});
			openlines.push({x1:segments[i].x2,            y1:segments[i].y2,            x2:points[points.length-1].x, y2:points[points.length-1].y, up:[t1]});
			
			// console.log("Inside:");
			// console.log(points[points.length-2].x, segments[i].x1);
			// console.log(segments[i].x2, points[points.length-1].x);
			// console.log("above added!");
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
			// temp.splice(index, 1);

			closeLeft_right = segments[i].rect;
			closeRight_left = segments[i].rect;

			t1 = -1;
			t2 = -1;
			if((segments[i].x1 - points[points.length-2].x) >0)
				{t1 = checkPossibleEmptyBlocks(points[points.length-2].x, points[points.length-2].y, segments[i].x1, segments[i].y1, closeLeft_left, closeLeft_right);}
			
			if((points[points.length-1].x - segments[i].x2) >0)
				{t2 = checkPossibleEmptyBlocks(segments[i].x2, segments[i].y2, points[points.length-1].x, points[points.length-1].y, closeRight_left, closeRight_right);}			
			
			pointer = [];
			if(t1 !=-1) pointer.push(t1);
			if(t2 !=-1) pointer.push(t2);
			openlines.push({x1:points[points.length-2].x, y1:points[points.length-2].y, x2:points[points.length-1].x, y2:points[points.length-1].y, up:pointer});
			// console.log(points[points.length-2].x, points[points.length-1].x);
		}
		// console.log("After ", i, emptyBlocks.length, emptyBlocks, openlines);

		linesegments.push({x1:points[points.length-2].x, y1:points[points.length-2].y, x2:points[points.length-1].x, y2:points[points.length-1].y });
		// linedash(points[points.length-2].x, points[points.length-2].y, points[points.length-1].x, points[points.length-1].y);
		// console.log(isopen, index, points[points.length-2], points[points.length-1], temp);
		// circle(points[points.length-1].x, points[points.length-1].y, 8); 
		// circle(points[points.length-2].x, points[points.length-2].y, 8); 
		// console.log("so now:", emptyBlocks);
	}

	// console.log("here", linesegments);
	var x1, y1, x2, y2;
	x1 = openlines[openlines.length-1].x1;
	y1 = openlines[openlines.length-1].y1;
	x2 = openlines[openlines.length-1].x2;
	y2 = openlines[openlines.length-1].y2;

	r = emptyBlocks.length+1;
	var top_pointers = openlines[openlines.length-1].up;	// upper block pointer
	
	// console.log("--------------\nlast end line, top pointers:", top_pointers);
	for (var i = 0; i < top_pointers.length; i++) {
		// console.log("here2:", emptyBlocks, top_pointers);
		emptyBlocks[top_pointers[i]-1].down.push(r);
	}
	emptyBlocks.push({up:top_pointers, down:[], left:null, right:null, x1: x1, y1: y1, w:WIDTH , h:(HEIGHT-y2), rank:r});

	// console.log("last", r);
}


/*
		left
		_____
		|	|
	up  |	| down
		-----
		right
*/
function getdots2(){
	var index;
	var temp = [];
	var left, right;
	var isopen;
	var closeLeft_left;
	var closeLeft_right;
	var closeRight_left;
	var closeRight_right;
	var R1, R2, t1, t2, r, pointer;
	openlines2 = [];
	openlines2.push({x1:0, y1:0, x2:0, y2:HEIGHT, up:[]});

	for (var i = 0; i< segments2.length; i++) {
		index  = flooring2(segments2[i].y1);
		isopen = segments2[i].open;
		if(isopen){					// rectangle opening 
			if(index == -1){		// no left exist
				sweepLineStatus2.splice(0, 0, segments2[i]);
				// console.log("here",segments2[i]);
				// temp.splice(0, 0, segments2[i].x1);
				points2.push({x: segments2[i].x1,     y:0});
				R1 = null;

				right = 1;
				if(right == sweepLineStatus2.length)		// no right exist
					{points2.push({x:segments2[i].x1, y:HEIGHT}); R2 = null;}
				else 									// right exist
					{points2.push({x:segments2[i].x1, y:sweepLineStatus2[1].rect.y1}); R2 = sweepLineStatus2[1].rect;}
			}
			else{
				sweepLineStatus2.splice(index+1, 0, segments2[i]);
				// temp.splice(index+1, 0, segments2[i].x1);
				left  = index; 
				points2.push({x:segments2[i].x1, y:sweepLineStatus2[left].rect.y4});
				R1 = sweepLineStatus2[left].rect;

				right = index + 2;
				if(right == sweepLineStatus2.length)
					{points2.push({x:segments2[i].x1, y:HEIGHT}); R2 = null;}
				else
					{points2.push({x:segments2[i].x1, y:sweepLineStatus2[right].rect.y1}); R2 = sweepLineStatus2[right].rect;}
			}
			// ------------------------------------------------------
			// console.log("checking opening:...");
			t1 = checkPossibleEmptyBlocks2(points2[points2.length-2].x, points2[points2.length-2].y, points2[points2.length-1].x, points2[points2.length-1].y, R1, R2);			
			openlines2.push({x1:points2[points2.length-2].x, y1:points2[points2.length-2].y, x2:segments2[i].x1,            y2:segments2[i].y1,            up:[t1]});
			openlines2.push({x1:segments2[i].x2,             y1:segments2[i].y2,            x2:points2[points2.length-1].x, y2:points2[points2.length-1].y, up:[t1]});
			// console.log("pushing2a 1):",points2[points2.length-2].x, points2[points2.length-2].y, segments2[i].x1, segments2[i].y1, [t1]);
			// console.log("pushing2a 2):",segments2[i].x2, segments2[i].y2, points2[points2.length-1].x, points2[points2.length-1].y, [t1]);
			
			// console.log("checking done!");
			// console.log("Inside:");
			// console.log(points[points.length-2].x, segments[i].x1);
			// console.log(segments[i].x2, points[points.length-1].x);
			// console.log("above added!");
		}else{						// rectangle closing
			left  = index-1;
			if(left == -1)
				{points2.push({x:segments2[i].x1, y:0});  closeLeft_left= null;}
			else
				{points2.push({x:segments2[i].x1, y:sweepLineStatus2[left].rect.y4}); closeLeft_left = sweepLineStatus2[left].rect;}
			

			right = index+1; 
			if(right == sweepLineStatus2.length)
				{points2.push({x:segments2[i].x1, y:HEIGHT}); closeRight_right = null;}
			else
				{points2.push({x:segments2[i].x1, y:sweepLineStatus2[right].rect.y1}); closeRight_right = sweepLineStatus2[right].rect;}
			
			sweepLineStatus2.splice(index, 1);
			// temp.splice(index, 1);

			closeLeft_right = segments2[i].rect;
			closeRight_left = segments2[i].rect;

			t1 = -1;
			t2 = -1;
			// console.log("checking opening 2a:...");
			if((segments2[i].y1 - points2[points2.length-2].y) >0)
				{t1 = checkPossibleEmptyBlocks2(points2[points2.length-2].x, points2[points2.length-2].y, segments2[i].x1, segments2[i].y1, closeLeft_left, closeLeft_right);}
			// console.log("checking 2a done");
			
			// console.log("checking opening 2b...");
			if((points2[points2.length-1].y - segments2[i].y2) >0)
				{t2 = checkPossibleEmptyBlocks2(segments2[i].x2, segments2[i].y2, points2[points2.length-1].x, points2[points2.length-1].y, closeRight_left, closeRight_right);}			
			// console.log("checking 2b done");
			

			pointer = [];
			if(t1 !=-1) pointer.push(t1);
			if(t2 !=-1) pointer.push(t2);
			// console.log("pushing2b:", pointer);
			openlines2.push({x1:points2[points2.length-2].x, y1:points2[points2.length-2].y, x2:points2[points2.length-1].x, y2:points2[points2.length-1].y, up:pointer});
			// console.log(points[points.length-2].x, points[points.length-1].x);
		}
		// console.log("After ", i, emptyBlocks.length, emptyBlocks, openlines);

		linesegments2.push({x1:points2[points2.length-2].x, y1:points2[points2.length-2].y, x2:points2[points2.length-1].x, y2:points2[points2.length-1].y });
		// linedash(points[points.length-2].x, points[points.length-2].y, points[points.length-1].x, points[points.length-1].y);
		// console.log(isopen, index, points[points.length-2], points[points.length-1], temp);
		// circle(points[points.length-1].x, points[points.length-1].y, 8); 
		// circle(points[points.length-2].x, points[points.length-2].y, 8); 
		// console.log("so now:", emptyBlocks);
	}

	// console.log("here", linesegments);
	var x1, y1, x2, y2;
	x1 = openlines2[openlines2.length-1].x1;
	y1 = openlines2[openlines2.length-1].y1;
	x2 = openlines2[openlines2.length-1].x2;
	y2 = openlines2[openlines2.length-1].y2;

	r = emptyBlocks2.length+1;
	var top_pointers = openlines2[openlines2.length-1].up;	// upper block pointer
	
	// console.log("--------------\nlast end line, top pointers:", top_pointers);
	for (var i = 0; i < top_pointers.length; i++) {
		// console.log("here2:", emptyBlocks, top_pointers);
		emptyBlocks2[top_pointers[i]-1].down.push(r);
	}
	emptyBlocks2.push({up:top_pointers, down:[], left:null, right:null, x1: x1, y1: y1, w:(WIDTH-x2), h:HEIGHT, rank:r});
	// console.log("last", r);
}

function checkPossibleEmptyBlocks(px1, py1, px2, py2, R1, R2){
	var x1, y1, x2, y2, flag=0, UP, DOWN, LEFT, RIGHT, r, top_pointers;
	for (var i = 0; i < openlines.length; i++) {
		x1 = openlines[i].x1;
		y1 = openlines[i].y1;
		x2 = openlines[i].x2;
		y2 = openlines[i].y2;
		if(x1==px1 && x2==px2){
			flag +=1;
			{	UP    = [];
				DOWN  = [];
				LEFT  = (R1==null)?null:R1.rank;
				RIGHT = (R2==null)?null:R2.rank;
				r = emptyBlocks.length+1;
				top_pointers = openlines[i].up;	// upper block pointer
				UP = top_pointers;
				for (var j = 0; j < top_pointers.length; j++) {
					emptyBlocks[top_pointers[j]-1].down.push(r);
				}
				emptyBlocks.push({up:UP, down:DOWN, left:LEFT, right:RIGHT, x1: x1, y1: y1, w:(x2-x1) , h:(py2-y2), rank:r});				
			}
			openlines.splice(i, 1);
			return r;
		}
		if(flag>1){
			console.log("Error", emptyBlocks);
		}
	}
	return -1;
}

function checkPossibleEmptyBlocks2(px1, py1, px2, py2, R1, R2){
	var x1, y1, x2, y2, flag=0, UP, DOWN, LEFT, RIGHT, r, top_pointers;
	for (var i = 0; i < openlines2.length; i++) {
		x1 = openlines2[i].x1;
		y1 = openlines2[i].y1;
		x2 = openlines2[i].x2;
		y2 = openlines2[i].y2;
		if(y1==py1 && y2==py2){
			flag +=1; 
			{	UP    = [];
				DOWN  = [];
				LEFT  = (R1==null)?null:R1.rank;
				RIGHT = (R2==null)?null:R2.rank;
				r = emptyBlocks2.length+1;
				top_pointers = openlines2[i].up;	// upper block pointer
				UP = top_pointers;
				// console.log("here2:",top_pointers);
				for (var j = 0; j < top_pointers.length; j++) {
					emptyBlocks2[top_pointers[j]-1].down.push(r);
				}
				emptyBlocks2.push({up:UP, down:DOWN, left:LEFT, right:RIGHT, x1: x1, y1: y1, w:(px1-x1) , h:(y2-y1), rank:r});
				// console.log("done2");
			}
			openlines2.splice(i, 1);
			return r;
		}
		if(flag>1){
			console.log("Error", emptyBlocks2);
		}
	}
	return -1;
}


function get_max_Area(block_num){

	var L    = emptyBlocks[block_num-1].x1;
	var R    = emptyBlocks[block_num-1].x1 + emptyBlocks[block_num-1].w;
	var upwards   = move_up(block_num, L, R);
	var downwards = move_down(block_num, L, R);
	var result_ = {
		x1 : emptyBlocks[block_num-1].x1,
		y1 : (emptyBlocks[block_num-1].y1 + emptyBlocks[block_num-1].h - upwards),
		w  : emptyBlocks[block_num-1].w,
		h  : (upwards+downwards-emptyBlocks[block_num-1].h),
		area : (emptyBlocks[block_num-1].w)*(upwards+downwards-emptyBlocks[block_num-1].h)
	}
	return result_;
}
function move_up(block_num, L ,R){
	var l = emptyBlocks[block_num-1].x1;
	var r = emptyBlocks[block_num-1].x1 + emptyBlocks[block_num-1].w;
	if(!(l<=L && R<=r)){
		return 0;
	}
	var t = 0, v, bn;
	var ans = emptyBlocks[block_num-1].h;
	var temp = 0;
	for (var i = 0; i < emptyBlocks[block_num-1].up.length; i++) {
		bn = emptyBlocks[block_num-1].up[i];
		temp = max(temp, move_up(bn, L ,R));
	}
	return ans + temp;
}
function move_down(block_num, L ,R){
	var l = emptyBlocks[block_num-1].x1;
	var r = emptyBlocks[block_num-1].x1 + emptyBlocks[block_num-1].w;
	if(!(l<=L && R<=r)){
		return 0;
	}
	var t = 0, v, bn;
	var ans = emptyBlocks[block_num-1].h;
	var temp = 0;
	for (var i = 0; i < emptyBlocks[block_num-1].down.length; i++) {
		bn = emptyBlocks[block_num-1].down[i];
		temp = max(temp, move_down(bn, L ,R));
	}
	return ans + temp;
}

function get_max_Area2(block_num){
	var L    = emptyBlocks2[block_num-1].y1;
	var R    = emptyBlocks2[block_num-1].y1 + emptyBlocks2[block_num-1].h;
	var upwards   = move_up2(block_num, L, R);
	var downwards = move_down2(block_num, L, R);
	var result_ = {
		x1 : (emptyBlocks2[block_num-1].x1 + emptyBlocks2[block_num-1].w - upwards),
		y1 : emptyBlocks2[block_num-1].y1,
		w  : (upwards+downwards-emptyBlocks2[block_num-1].w),
		h  : emptyBlocks2[block_num-1].h,
		area : (upwards+downwards-emptyBlocks2[block_num-1].w)*(emptyBlocks2[block_num-1].h)
	}
	return result_;
}
function move_up2(block_num, L ,R){
	var l = emptyBlocks2[block_num-1].y1;
	var r = emptyBlocks2[block_num-1].y1 + emptyBlocks2[block_num-1].h;
	if(!(l<=L && R<=r)){
		return 0;
	}
	var t = 0, v, bn;
	var ans  = emptyBlocks2[block_num-1].w;
	var temp = 0;
	for (var i = 0; i < emptyBlocks2[block_num-1].up.length; i++) {
		bn = emptyBlocks2[block_num-1].up[i];
		temp = max(temp, move_up2(bn, L ,R));
	}
	return ans + temp;
}
function move_down2(block_num, L ,R){
	var l = emptyBlocks2[block_num-1].y1;
	var r = emptyBlocks2[block_num-1].y1 + emptyBlocks2[block_num-1].h;
	if(!(l<=L && R<=r)){
		return 0;
	}
	var t = 0, v, bn;
	var ans = emptyBlocks2[block_num-1].w;
	var temp = 0;
	for (var i = 0; i < emptyBlocks2[block_num-1].down.length; i++) {
		bn = emptyBlocks2[block_num-1].down[i];
		temp = max(temp, move_down2(bn, L ,R));
	}
	return ans + temp;
}



// function removeDuplicates(argument) {
// 	var curr, next;
// 	var result = [];
// 	if(segments.length<1) return;
	
// 	result.push(segments[0]);
// 	var curr;
// 	for (var i = 1; i < segments.length; i++) {
// 		curr = segments[i].y1;
// 		last = result[result.length-1].y1;
// 		if(curr==last){
// 			continue;
// 		}else{
// 			result.push(segments[i]);
// 		}
// 	}
// 	segments = [];
// 	segments = result;
// 	result = [];
// }

// function showHorLine(){
// 	// console.log(rectangles);
// 	rectangles.sort(function(r1, r2){
// 		if(r1.x1 < r2.x1) return -1;
// 		return 0;
// 	});
// 	// console.log(rectangles);
// }
