const  mathVisual = {};

mathVisual.fractionBar = (canvasElement, numerator, denominator, borderWidth=5, colorFill="rgb(120, 190, 250)") => {

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
    canvas.fillRect(borderWidth, borderWidth, canvasElement.width -  (borderWidth*2), canvasElement.height - (borderWidth*2));
    canvas.fillStyle = colorFill;
    canvas.fillRect(borderWidth, borderWidth, shaded - borderWidth, canvasElement.height - borderWidth);

    for (let i = 1; i < denominator; i++) {
        canvas.beginPath();
        canvas.moveTo(separator, 0);
        canvas.lineTo(separator, canvasElement.height);
        canvas.closePath();
        canvas.lineWidth = borderWidth;
        canvas.stroke();
        separator = separator + interval;
    }
}




mathVisual.fractionCircle = (canvasElement, numerator, denominator, borderWidth=5, colorFill="rgb(120, 190, 250)") => {

    if (numerator < 0 || denominator < 0) {
        return alert(
            `Please enter a positive numerator and denominator. `
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
canvas.lineWidth = borderWidth;
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

}



mathVisual.fractionDivision = 
(canvasElement, wholeNum1, numerator1, denominator1, wholeNum2, numerator2, denominator2, style="bar") => {
    let canvas = canvasElement.getContext("2d");

}