// Global Functions

function downloadPng(canvasEl) {
    const canvas = document.getElementById(canvasEl) // Gets canvas element from html
    const link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = 'canvas_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function basicFrac() {

    // HTML Elements from the basic fraction page
    const generateBasicButton = (document.getElementById("generate-basic"));

    generateBasicButton.addEventListener("click", function () {
        const basicCanvas = document.getElementById("basic-canvas");
        const numerator = parseInt(document.getElementById("basic-numerator").value);
        const denominator= parseInt(document.getElementById("basic-denominator").value);
        mathVisual.fractionCircle(basicCanvas, numerator, denominator);
    });

    const basicPngButton = document.getElementById("basic-png-button");
    basicPngButton.addEventListener("click", function () {
        downloadPng("basic-canvas");
    })

}

function multiplicationFrac() {

// HTML Elements from the Multiplication page
const generateMultiplicationButton = document.getElementById("generate-multiplication");

generateMultiplicationButton.addEventListener("click", function () {
    const multiplicationCanvas = document.getElementById("multiplication-canvas");
    const multWholeNum1 = parseInt(document.getElementById("multiplication-whole-number1").value);
    const multNumerator1 = parseInt(document.getElementById("multiplication-numerator1").value);
    const multDenominator1 = parseInt(document.getElementById("multiplication-denominator1").value);
    const multWholeNum2 = parseInt(document.getElementById("multiplication-whole-number2").value);
    const multNumerator2 = parseInt(document.getElementById("multiplication-numerator2").value);
    const multDenominator2 = parseInt (document.getElementById("multiplication-denominator2").value);

    mathVisual.fractionMultiplication(multiplicationCanvas, multWholeNum1, multNumerator1, multDenominator1, multWholeNum2, multNumerator2, multDenominator2);
});

}

function divisionFrac() {
// HTML Elements from the Division page
const generateDivisionButton = document.getElementById("generate-division");

generateDivisionButton.addEventListener("click", function () {
    const divisionCanvas = document.getElementById("division-canvas");
    const divisionWholeNum1 = parseInt(document.getElementById("division-whole-number1").value);
    const divisionNumerator1 = parseInt(document.getElementById("division-numerator1").value);
    const divisionDenominator1 = parseInt(document.getElementById("division-denominator1").value);
    const divisionNumerator2 = parseInt(document.getElementById("division-numerator2").value);
    const divisionDenominator2 = parseInt (document.getElementById("division-denominator2").value);

    mathVisual.fractionDivision(divisionCanvas, divisionWholeNum1, divisionNumerator1, divisionDenominator1, divisionNumerator2, divisionDenominator2);
});

const divisionPngButton = document.getElementById("division-png-button");
divisionPngButton.addEventListener("click", function () {
    downloadPng("division-canvas");
})

}



