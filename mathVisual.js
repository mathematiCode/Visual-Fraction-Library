const  mathVisual = {};

mathVisual.fractionBar = (canvasElement, numerator, denominator, lineThickness=5, colorFill="rgb(120, 190, 250)") => {

    let canvas = canvasElement.getContext("2d");

    if (numerator > denominator) {
        return alert(
            `Please enter a proper fraction. num=${numerator} denom=${denominator} ${
                numerator > denominator
            }`
        );
    }
canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const interval =  canvasElement.width/ denominator;
    let separator = interval; // Need two variables becuase separator will increment while interval stays constant. 

    let shaded = interval * numerator;
    canvas.fillStyle = "black";
    canvas.fillRect(0, 0, canvasElement.width, canvasElement.height);
    canvas.fillStyle = "white";
    canvas.fillRect(lineThickness, lineThickness, canvasElement.width -  (lineThickness*2), canvasElement.height - (lineThickness*2));
    canvas.fillStyle = colorFill;
    canvas.fillRect(lineThickness, lineThickness, shaded - lineThickness, canvasElement.height - lineThickness);

    for (let i = 1; i < denominator; i++) {
        canvas.beginPath();
        canvas.moveTo(separator, 0);
        canvas.lineTo(separator, canvasElement.height);
        canvas.closePath();
        canvas.lineWidth = lineThickness;
        canvas.stroke();
        separator = separator + interval;
    }
}

mathVisual.fractionCircle = (canvasElement, numerator, denominator, lineThickness=5, colorFill="rgb(120, 190, 250)") => {

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
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);


// Set the circle properties
const x = canvasElement.width/2; // x-coordinate of the center
const y = canvasElement.height/2; // y-coordinate of the center
let radius = 0;
if (canvasElement.width <= canvasElement.height) { 
 radius = canvasElement.width / 2 - 10;
}
else {  radius = canvasElement.height/2 - 10; }
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

    if (wholeNum1 === 0 && wholeNum2 === 0) {

    }

}

mathVisual.fractionDivision = 
(canvasElement, wholeNum1, numerator1, denominator1, numerator2, denominator2, lineThickness=5, colorFill="rgb(120, 190, 250)", style="bar") => {
    let canvas = canvasElement.getContext("2d");
    let numSections;

    // Need to add error handling for decimal inputs or blank inputs

    if (wholeNum1 < 0 || numerator1 < 0 || denominator1 <0 || numerator2 <0 || denominator2<0) { 
        return alert(
            `Please enter a positive number in each box.`
        );
    }
    else if (wholeNum1 === 0 && numerator1 ===0) {
        return alert(
            `Please enter a positive number in each box.`
        );
    }
    else if (denominator1 === 0 || denominator2 === 0) 
    {
        return alert(
            `All denominators must be positive.`
        );
    }
    else if (wholeNum1 === 0) { numSections = denominator1 }
    else if (numerator1 === 0) { numSections = wholeNum1 }
    else { numSections = wholeNum1 +1 } 

    const interval = canvasElement.width / numSections;
    let separator = interval;


    canvas.fillStyle = "black";
    canvas.fillRect(0, 0, canvasElement.width, canvasElement.height);
    canvas.fillStyle = "white";
    canvas.fillRect(lineThickness, lineThickness, canvasElement.width -  (lineThickness*2), canvasElement.height - (lineThickness*2));
    // canvas.fillStyle = colorFill;
    // canvas.fillRect(lineThickness, lineThickness, shaded - lineThickness, canvasElement.height - lineThickness);

    for (let i = 1; i < numSections; i++) {
        canvas.beginPath();
        canvas.moveTo(separator, 0);
        canvas.lineTo(separator, canvasElement.height);
        canvas.closePath();
        canvas.lineWidth = lineThickness;
        canvas.stroke();
        separator = separator + interval;
    }


}