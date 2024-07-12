

// HTML Elements from the basic fraction page
const generateBasicButton = (document.getElementById("generate-basic"));

generateBasicButton.addEventListener("click", function () {
    const basicCanvas = document.getElementById("basic-canvas");
    const numerator = parseInt(document.getElementById("basic-numerator").value);
    const denominator= parseInt(document.getElementById("basic-denominator").value);
    mathVisual.fractionCircle(basicCanvas, numerator, denominator);
});


// HTML Elements from the Multiplication page
const generateMultiplicationButton = document.getElementById("generate-multiplication");

generateMultiplicationButton.addEventListener("click", function () {
    const multiplicationCanvas = document.getElementById("multiplication-canvas");
    const multWholeNum1 = parseInt(document.getElementById("multiplication-whole-number1").value);
    const multNumerator1 = parseInt(getElementById("multiplication-numerator1").value);
    const multDenominator1 = parseInt(getElementById("multiplication-denominator1").value);
    const multWholeNum2 = parseInt(getElementById("multiplication-whole-number2").value);
    const multNumerator2 = parseInt(getElementById("multiplication-numerator2").value);
    const multDenominator2 = parseInt (getElementById("multiplication-denominator2").value);

    mathVisual.fractionMultiplication(multiplicationCanvas, multWholeNum1, multNumerator1, multDenominator1, multWholeNum2, multNumerator2, multDenominator2);
});

// HTML Elements from the Division page
const generateDivisionButton = document.getElementById("generate-division");

generateDivisionButton.addEventListener("click", function () {
    const divisionCanvas = document.getElementById("division-canvas");
    const multWholeNum1 = parseInt(document.getElementById("division-whole-number1").value);
    const multNumerator1 = parseInt(getElementById("division-numerator1").value);
    const multDenominator1 = parseInt(getElementById("division-denominator1").value);
    const multWholeNum2 = parseInt(getElementById("division-whole-number2").value);
    const multNumerator2 = parseInt(getElementById("division-numerator2").value);
    const multDenominator2 = parseInt (getElementById("division-denominator2").value);

    mathVisual.fractionDivision(divisionCanvas, divisionWholeNum1, divisionNumerator1, divisionDenominator1, divisionWholeNum2, divisionNumerator2, divisionDenominator2);
});



