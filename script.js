// Global Functions

function downloadPng(canvasEl) {
  const canvas = document.getElementById(canvasEl); // Gets canvas element from html
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "canvas_image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function basicFrac() {
  // HTML Elements from the basic fraction page
  const generateBasicButton = document.getElementById("generate-basic");
  const modelToggle = document.getElementById("basic-model-toggle");
  const basicCanvas = document.getElementById("basic-canvas");

  generateBasicButton.addEventListener("click", function () {
    const numerator = parseInt(
      document.getElementById("basic-numerator").value
    );
    const denominator = parseInt(
      document.getElementById("basic-denominator").value
    );

    const wholeNum = parseInt(
      document.getElementById("basic-whole-number").value
    );

    if (modelToggle.checked) {
      mathVisual.fractionBar(basicCanvas, wholeNum, numerator, denominator);
    } else {
      mathVisual.fractionCircle(basicCanvas, wholeNum, numerator, denominator);
    }
  });

  modelToggle.addEventListener("change", () => {
    const numerator = parseInt(
      document.getElementById("basic-numerator").value
    );
    const denominator = parseInt(
      document.getElementById("basic-denominator").value
    );
    if (modelToggle.checked) {
      mathVisual.fractionBar(basicCanvas, numerator, denominator);
    } else {
      mathVisual.fractionCircle(basicCanvas, numerator, denominator);
    }
  });

  const basicPngButton = document.getElementById("basic-png-button");
  basicPngButton.addEventListener("click", function () {
    downloadPng("basic-canvas");
  });
}

function multiplicationFrac() {
  // HTML Elements from the Multiplication page
  const generateMultiplicationButton = document.getElementById(
    "generate-multiplication"
  );

  generateMultiplicationButton.addEventListener("click", function () {
    const multiplicationCanvas = document.getElementById(
      "multiplication-canvas"
    );
    const multWholeNum1 = parseInt(
      document.getElementById("multiplication-whole-number1").value
    );
    const multNumerator1 = parseInt(
      document.getElementById("multiplication-numerator1").value
    );
    const multDenominator1 = parseInt(
      document.getElementById("multiplication-denominator1").value
    );
    const multWholeNum2 = parseInt(
      document.getElementById("multiplication-whole-number2").value
    );
    const multNumerator2 = parseInt(
      document.getElementById("multiplication-numerator2").value
    );
    const multDenominator2 = parseInt(
      document.getElementById("multiplication-denominator2").value
    );

    mathVisual.fractionMultiplication(
      multiplicationCanvas,
      multWholeNum1,
      multNumerator1,
      multDenominator1,
      multWholeNum2,
      multNumerator2,
      multDenominator2
    );
  });
}

function divisionFrac() {
  // HTML Elements from the Division page
  const generateDivisionButton = document.getElementById("generate-division");
  const modelToggle = document.getElementById("division-model-toggle");

  generateDivisionButton.addEventListener("click", function () {
    const divisionCanvas = document.getElementById("division-canvas");
    const divisionWholeNum1 = parseInt(
      document.getElementById("division-whole-number1").value
    );
    const divisionNumerator1 = parseInt(
      document.getElementById("division-numerator1").value
    );
    const divisionDenominator1 = parseInt(
      document.getElementById("division-denominator1").value
    );
    const divisionNumerator2 = parseInt(
      document.getElementById("division-numerator2").value
    );
    const divisionDenominator2 = parseInt(
      document.getElementById("division-denominator2").value
    );

    if (modelToggle.checked) {
      mathVisual.fractionDivisionBar(
        divisionCanvas,
        divisionWholeNum1,
        divisionNumerator1,
        divisionDenominator1,
        divisionNumerator2,
        divisionDenominator2
      );
    } else {
      mathVisual.fractionDivisionCircles(
        divisionCanvas,
        divisionWholeNum1,
        divisionNumerator1,
        divisionDenominator1,
        divisionNumerator2,
        divisionDenominator2,
        (lineThickness = 5),
        (colorFill = "#52a4b0"),
        (colorFill2 = "#f0a68c")
      );
    }
  });

  const divisionPngButton = document.getElementById("division-png-button");
  divisionPngButton.addEventListener("click", function () {
    downloadPng("division-canvas");
  });

  modelToggle.addEventListener("change", () => {
    const divisionCanvas = document.getElementById("division-canvas");
    const divisionWholeNum1 = parseInt(
      document.getElementById("division-whole-number1").value
    );
    const divisionNumerator1 = parseInt(
      document.getElementById("division-numerator1").value
    );
    const divisionDenominator1 = parseInt(
      document.getElementById("division-denominator1").value
    );
    const divisionNumerator2 = parseInt(
      document.getElementById("division-numerator2").value
    );
    const divisionDenominator2 = parseInt(
      document.getElementById("division-denominator2").value
    );

    if (modelToggle.checked) {
      mathVisual.fractionDivisionBar(
        divisionCanvas,
        divisionWholeNum1,
        divisionNumerator1,
        divisionDenominator1,
        divisionNumerator2,
        divisionDenominator2
      );
    } else {
      mathVisual.fractionDivisionCircles(
        divisionCanvas,
        divisionWholeNum1,
        divisionNumerator1,
        divisionDenominator1,
        divisionNumerator2,
        divisionDenominator2,
        (lineThickness = 5),
        (colorFill = "#52a4b0"),
        (colorFill2 = "#f0a68c")
      );
    }
  });
}
