// Global Functions

function downloadPng(canvasEl) {
  const canvas = document.getElementById(canvasEl); // Gets canvas element from html
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadSvg(svgEl) {
  if (svgEl instanceof Node) {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([xmlString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("The object is not a node.");
  }
}

function basicFrac() {
  // HTML Elements from the basic fraction page
  const generateBasicButton = document.getElementById("generate-basic");
  const modelToggle = document.getElementById("basic-model-toggle");
  const basicSVG = document.getElementById("basic-svg");

  generateBasicButton.addEventListener("click", function () {
    const wholeNum = parseInt(
      document.getElementById("basic-whole-number").value
    );
    const numerator = parseInt(
      document.getElementById("basic-numerator").value
    );
    const denominator = parseInt(
      document.getElementById("basic-denominator").value
    );

    basicSVG.innerHTML = "";
    if (modelToggle.checked) {
      mathVisual.fractionBar(basicSVG, wholeNum, numerator, denominator);
    } else {
      mathVisual.fractionCircle(basicSVG, wholeNum, numerator, denominator);
    }
  });

  modelToggle.addEventListener("change", () => {
    const wholeNum = parseInt(
      document.getElementById("basic-whole-number").value
    );
    const numerator = parseInt(
      document.getElementById("basic-numerator").value
    );
    const denominator = parseInt(
      document.getElementById("basic-denominator").value
    );
    basicSVG.innerHTML = "";
    if (modelToggle.checked) {
      mathVisual.fractionBar(basicSVG, wholeNum, numerator, denominator);
    } else {
      mathVisual.fractionCircle(basicSVG, wholeNum, numerator, denominator);
    }
  });

  const downloadPngButton = document.getElementById("basic-png-button");
  const downloadBasicSVGButton = document.getElementById("basic-svg-button");
  downloadPngButton.addEventListener("click", function () {
    downloadPng("basic-SVG");
  });
  downloadBasicSVGButton.addEventListener("click", function () {
    downloadSvg(basicSVG);
  });
}

function multiplicationFrac() {
  // HTML Elements from the Multiplication page
  const generateMultiplicationButton = document.getElementById(
    "generate-multiplication"
  );

  generateMultiplicationButton.addEventListener("click", function () {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    let factor1 = {};
    const factor2 = {};
    factor1.wholeNum = parseInt(
      document.getElementById("multiplication-whole-number1").value
    );
    factor1.numerator = parseInt(
      document.getElementById("multiplication-numerator1").value
    );
    factor1.denominator = parseInt(
      document.getElementById("multiplication-denominator1").value
    );
    factor2.wholeNum = parseInt(
      document.getElementById("multiplication-whole-number2").value
    );
    factor2.numerator = parseInt(
      document.getElementById("multiplication-numerator2").value
    );
    factor2.denominator = parseInt(
      document.getElementById("multiplication-denominator2").value
    );

    multiplicationSVG.innerHTML = "";
    mathVisual.fractionMultiplicationAreaModel(
      multiplicationSVG,
      factor1,
      factor2
    );
  });
}

function divisionFrac() {
  // HTML Elements from the Division page
  const generateDivisionButton = document.getElementById("generate-division");
  const modelToggle = document.getElementById("division-model-toggle");

  generateDivisionButton.addEventListener("click", function () {
    const divisionSVG = document.getElementById("division-svg");
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
    divisionSVG.innerHTML = "";
    if (modelToggle.checked) {
      mathVisual.fractionDivisionBar(
        divisionSVG,
        divisionWholeNum1,
        divisionNumerator1,
        divisionDenominator1,
        divisionNumerator2,
        divisionDenominator2
      );
    } else {
      mathVisual.fractionDivisionCircles(
        divisionSVG,
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
    downloadPng("division-svg");
  });
  const downloadDivisionSVG = document.getElementById("division-svg-button");
  downloadDivisionSVG.addEventListener("click", function () {
    const divisionSVG = document.getElementById("division-svg");
    downloadSvg(divisionSVG);
  });

  modelToggle.addEventListener("change", () => {
    const divisionSVG = document.getElementById("division-svg");
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
    divisionSVG.innerHTML = "";
    if (modelToggle.checked) {
      mathVisual.fractionDivisionBar(
        divisionSVG,
        divisionWholeNum1,
        divisionNumerator1,
        divisionDenominator1,
        divisionNumerator2,
        divisionDenominator2
      );
    } else {
      mathVisual.fractionDivisionCircles(
        divisionSVG,
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
