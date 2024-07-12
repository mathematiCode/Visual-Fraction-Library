let fractionCircle = document.getElementById("circle");
let denominatorInput = document.getElementById("basic-denominator");
let numeratorInput = document.getElementById("basic-numerator");
let generateButton = document.getElementById("generate-basic");

generateButton.addEventListener("click", function () {
    let numerator = parseInt(numeratorInput.value);
    let denominator = parseInt(denominatorInput.value);
    mathVisual.fractionCircle(fractionCircle, numerator, denominator);
});

