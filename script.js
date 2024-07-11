let fractionCircle = document.getElementById("circle");
let denominatorInput = document.getElementById("denominator");
let numeratorInput = document.getElementById("numerator");
let generateButton = document.getElementById("generate");

generateButton.addEventListener("click", function () {
    let numerator = parseInt(numeratorInput.value);
    let denominator = parseInt(denominatorInput.value);
    mathVisual.fractionCircle(fractionCircle, numerator, denominator);
});

