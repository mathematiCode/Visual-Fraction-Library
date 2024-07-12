const  mathVisual = {};

mathVisual.fractionBar = (canvasElement, numerator, denominator, lineThickness=5, colorFill="rgb(120, 190, 250)") => {

    let canvas = canvasElement.getContext("2d");
    const width = canvasElement.width;
    const height = canvasElement.height;

    if (numerator > denominator) {
        return alert(
            `Please enter a proper fraction. num=${numerator} denom=${denominator} ${
                numerator > denominator
            }`
        );
    }
canvas.clearRect(0, 0, width, height);
    const interval =  width/ denominator;
    let separator = interval; // Need two variables becuase separator will increment while interval stays constant. 

    let shaded = interval * numerator;
    canvas.fillStyle = "black";
    canvas.fillRect(0, 0, width, height);
    canvas.fillStyle = "white";
    canvas.fillRect(lineThickness, lineThickness, width -  (lineThickness*2), height - (lineThickness*2));
    canvas.fillStyle = colorFill;
    canvas.fillRect(lineThickness, lineThickness, shaded - lineThickness, height - lineThickness);

    for (let i = 1; i < denominator; i++) {
        canvas.beginPath();
        canvas.moveTo(separator, 0);
        canvas.lineTo(separator, height);
        canvas.closePath();
        canvas.lineWidth = lineThickness;
        canvas.stroke();
        separator = separator + interval;
    }
}

mathVisual.fractionCircle = (canvasElement, numerator, denominator, lineThickness=5, colorFill="rgb(120, 190, 250)") => {

    const width = canvasElement.width;
    const height = canvasElement.height;
    if (numerator < 0 || denominator < 0) {
        return alert(
            `Please enter a positive numerator and denominator.`
        );
}
   
    if (numerator > denominator) {
        return alert(
            `Please enter a proper fraction. num=${numerator} denom=${denominator} ${numerator > denominator}`
        );
    }

    let canvas = canvasElement.getContext("2d");
    canvas.clearRect(0, 0, width, height);


// Set the circle properties
const x = width/2; // x-coordinate of the center
const y = height/2; // y-coordinate of the center
let radius = 0;
if (width <= height) { 
 radius = width / 2 - 10;
}
else {  radius = height/2 - 10; }
const startAngle = 0; // starting angle (in radians)
const endAngle = 2 * Math.PI; // ending angle (in radians)

const angle = (Math.PI * 2) / denominator;
let currentAngle = angle;
let shaded = angle * numerator;

canvas.beginPath();
canvas.lineWidth = lineThickness;
canvas.arc(x,y,radius,startAngle, endAngle); // Drawing the outer circle
canvas.fillStyle = "white";
canvas.fill();
canvas.lineTo(x,y);
canvas.stroke();

canvas.beginPath(); // Filling in the shaded pieces
canvas.arc(x,y, radius, startAngle, shaded);
canvas.lineTo(x,y);
// I've only drawn an arc and one line, but when the fill() method is called, the canvas will automatically draw a line back to the starting point. So I do not need to explicitly create the 3rd line to close the path to be filled. 
canvas.fillStyle = colorFill;
canvas.fill();
canvas.stroke();

canvas.beginPath();
for (i=0; i<denominator; i++) { // Creating lines for each slice
    canvas.arc(x,y, radius, currentAngle, currentAngle+angle);
    canvas.lineTo(x,y);
    currentAngle = currentAngle+angle;
}
canvas.stroke();
}

mathVisual.fractionMultiplication = 
(canvasElement,  wholeNum1, numerator1, denominator1, wholeNum2, numerator2, denominator2, style="area") => {
    let canvas = canvasElement.getContext("2d");
    const width = canvasElement.width;
    const height = canvasElement.height;
    canvas.clearRect(0, 0, width, height);



    if (wholeNum1 === 0 && wholeNum2 === 0) {

    }

}

mathVisual.fractionDivision = 
(canvasElement, wholeNum1, numerator1, denominator1, numerator2, denominator2, lineThickness=5, colorFill="#337782", colorFill2 = "#f0a68c", style="bar") => {
    let canvas = canvasElement.getContext("2d");
    const width = canvasElement.width;
    const height = canvasElement.height;
    canvas.clearRect(0, 0, width, height);
    let numSections;


    // Need to add error handling for decimal inputs or blank inputs

    if (!wholeNum1) { wholeNum1 = 0 }; // If the wholeNum input is blank, the variable is set to 0. 

    if (wholeNum1 < 0 || numerator1 < 0 || denominator1 <0 || numerator2 <0 || denominator2<0) { 
        return alert(
            `Please enter a positive number in each box or leave it blank.`
        );
    }
    else if (wholeNum1 == 0 && numerator1 ==0) {
        return alert(
            `Please enter a positive dividend.`
        );
    }
    else if (denominator1 == 0 || denominator2 == 0) 
    {
        return alert(
            `All denominators must be positive.`
        );
    }
    else if (wholeNum1 == 0) { numSections = denominator1 }
    else if (numerator1 == 0) { numSections = wholeNum1 }
    else { numSections = wholeNum1 +1 } 

    const interval = width / numSections;
    let separator = interval;
    let dividend = 0;

    if (!numerator1) {numerator1 = 0};

    if (wholeNum1 == 0) { dividend = interval * numerator1 }
    else { dividend = interval* wholeNum1 + ((interval / denominator1)*numerator1) }

    canvas.fillStyle = "black";
    canvas.setLineDash([5, 5]);
    canvas.lineWidth = lineThickness*2;
    canvas.beginPath();
    canvas.moveTo(0,0);
    canvas.lineTo(0, height);
    canvas.lineTo(width, height);
    canvas.lineTo(width, 0);
    canvas.lineTo(0,0);
    canvas.stroke();

    canvas.fillStyle = "white";
    canvas.fillRect(lineThickness, lineThickness, width -  (lineThickness*2), height - (lineThickness*2));

    canvas.setLineDash([]); // Resets the line to solid instead of dashed
    canvas.fillStyle = "black";
    canvas.fillRect(0, 0, dividend, height);

// Removing this code from here for now to put it closer to the end so these lines display above the colored sections. I'm leaving here because I may add it back later if I want to have an animation that shows the original dividend and then counts by divisors one at a time. 

    // canvas.beginPath();
    // canvas.fillStyle = colorFill;
    // canvas.fillRect(lineThickness, lineThickness, dividend - lineThickness*2, height - lineThickness*2);
    // canvas.closePath();
    // canvas.stroke();

    // for (let i = 1; i < numSections; i++) {
    //     canvas.beginPath();
    //     canvas.moveTo(separator, 0);
    //     canvas.lineTo(separator, height);
    //     canvas.closePath();
    //     canvas.lineWidth = lineThickness;
    //     canvas.stroke();
    //     separator = separator + interval;
    // }

let segmenter; // This represents how big the divisor 
if (wholeNum1 == 0) { segmenter = (width / denominator2)*numerator2 }
else { segmenter = (interval / denominator2) * numerator2 }; 

let numSegments = (wholeNum1+1) * denominator2 / numerator2;


//color each section alternating colors
    for (let i=1; i<numSegments; i++) {
        if (i%2 == 0) {
            canvas.fillStyle = colorFill2;
            canvas.fillRect(segmenter*i-segmenter, lineThickness, segmenter*i, height-lineThickness*2);
        }
        else { 
            canvas.fillStyle = colorFill;
            canvas.fillRect(segmenter*i-segmenter - lineThickness*2, lineThickness, segmenter*i, height- lineThickness*2);
        }

        // Create dashed lines to segment each iteration of the divisor
        canvas.setLineDash([5, 10]);
        canvas.fillStyle = colorFill;
        canvas.beginPath();
        canvas.moveTo(segmenter*i, 0);
        canvas.lineTo(segmenter*i, height);
        canvas.closePath();
        canvas.stroke();
    }

// Create solid black outline
    canvas.beginPath();
    canvas.fillStyle = colorFill;
    // canvas.fillRect(lineThickness, lineThickness, dividend - lineThickness*2, height - lineThickness*2);
    canvas.closePath();
    canvas.stroke();


    canvas.setLineDash([]);
// Create solid separators for each whole OR if the dividend is less than one, for each portion
    for (let i = 1; i < numSections; i++) {
        canvas.beginPath();
        canvas.moveTo(separator, 0);
        canvas.lineTo(separator, height);
        canvas.closePath();
        canvas.lineWidth = lineThickness;
        canvas.stroke();
        separator = separator + interval;
    }



   
}