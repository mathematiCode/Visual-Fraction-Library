// Global Functions
const mathVisual = {};
// I made angleWherePiecesStart a global variable because I may change it later or make it customizable by the user. It means the circles will start shading at 270 degrees going counterclockwise. This is for fraction division circles so that if there are a few pieces that go in the same group as some in the next circle, they are closer together.
angleWherePiecesStart = Math.PI * 0.5;

function showCopiedVerification(copyButton) {
  copyButton.dataset.copied = "true";
  copyButton.innerHTML = "Copied!";
  setTimeout(function () {
    copyButton.dataset.copied = "false";
    copyButton.innerHTML = "Copy PNG";
  }, 5000);
}

function saveSettings(svg, numColors) {
  let customizations = {};
  customizations.colors = [];
  for (let i = 0; i < numColors; i++) {
    customizations.colors[i] = document.getElementById(`color${i + 1}`).value;
  }
  console.log(customizations.colors);
  customizations.borderColor = document.getElementById("border-color").value;
  let width = document.getElementById("width-input").value;
  let height = document.getElementById("height-input").value;
  customizations.lineThickness =
    document.getElementById("thickness-slider").value;
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  customizations.width = width;
  customizations.height = height;
  return customizations;
}

function revertSettings(color, lineThickness, width, height, borderColor) {
  document.getElementById("color1").value = color;
  document.getElementById("thickness-slider").value = lineThickness;
  document.getElementById("width-input").value = width;
  document.getElementById("height-input").value = height;
  document.getElementById("border-color").value = borderColor;
}

function basicFrac() {
  // HTML Elements from the basic fraction page
  const generateBasicButton = document.getElementById("generate-basic");
  const modelToggle = document.getElementById("basic-model-toggle");
  const basicSVG = document.getElementById("basic-svg");
  let mixedNum = {};
  color = "#52a4b0";
  lineThickness = 5;
  width = 800;
  height = 250;
  borderColor = "black";

  generateBasicButton.addEventListener("click", function () {
    mixedNum.wholeNum = parseInt(
      document.getElementById("basic-whole-number").value
    );
    mixedNum.numerator = parseInt(
      document.getElementById("basic-numerator").value
    );
    mixedNum.denominator = parseInt(
      document.getElementById("basic-denominator").value
    );

    basicSVG.innerHTML = "";
    basicSVG.setAttribute("width", Math.min(width, window.innerWidth * 0.8));
    if (modelToggle.checked) {
      mathVisual.fractionBar(
        basicSVG,
        mixedNum,
        lineThickness,
        color,
        borderColor
      );
    } else {
      mathVisual.fractionCircle(
        basicSVG,
        mixedNum,
        lineThickness,
        color,
        borderColor
      );
    }
  });

  modelToggle.addEventListener("change", () => {
    mixedNum.wholeNum = parseInt(
      document.getElementById("basic-whole-number").value
    );
    mixedNum.numerator = parseInt(
      document.getElementById("basic-numerator").value
    );
    mixedNum.denominator = parseInt(
      document.getElementById("basic-denominator").value
    );
    basicSVG.innerHTML = "";
    basicSVG.setAttribute("width", Math.min(width, window.innerWidth * 0.8));
    if (modelToggle.checked) {
      mathVisual.fractionBar(
        basicSVG,
        mixedNum,
        lineThickness,
        color,
        borderColor
      );
    } else {
      mathVisual.fractionCircle(
        basicSVG,
        mixedNum,
        lineThickness,
        color,
        borderColor
      );
    }
  });

  const downloadPngButton = document.getElementById("basic-png-button");
  const downloadBasicSVGButton = document.getElementById("basic-svg-button");
  const copyPngButton = document.getElementById("basic-copy-button");
  downloadPngButton.addEventListener("click", function () {
    downloadPng(basicSVG);
  });
  downloadBasicSVGButton.addEventListener("click", function () {
    downloadSvg(basicSVG);
  });
  copyPngButton.addEventListener("click", function () {
    copyPngToClipboard(basicSVG);
    showCopiedVerification(copyPngButton);
  });

  let saveSettingsButton = document.getElementById("save-button");
  saveSettingsButton.addEventListener("click", () => {
    let customizations = saveSettings(basicSVG, 1);
    color = customizations.colors[0];
    lineThickness = customizations.lineThickness;
    width = customizations.width;
    height = customizations.height;
    borderColor = customizations.borderColor;
    basicSVG.innerHTML = "";
    if (modelToggle.checked) {
      mathVisual.fractionBar(
        basicSVG,
        mixedNum,
        lineThickness,
        color,
        borderColor
      );
    } else {
      mathVisual.fractionCircle(
        basicSVG,
        mixedNum,
        lineThickness,
        color,
        borderColor
      );
    }
  });

  let cancelSettingsButton = document.getElementById("cancel-button");
  cancelSettingsButton.addEventListener("click", () => {
    revertSettings(color, lineThickness, width, height, borderColor);
  });
}

function multiplicationFrac() {
  // HTML Elements from the Multiplication page
  const generateMultiplicationButton = document.getElementById(
    "generate-multiplication"
  );

  let openCloseNavButton = document.querySelector(".corner-logo");
  let sideNav = document.querySelector(".side-nav");
  let toScaleLabel = document.getElementById("to-scale-label");
  let showBorderLabel = document.getElementById("show-border-label");
  const factorLabels = document.querySelectorAll(".factor-label");
  const factor2Fraction = document.getElementById("factor2-fraction");

  let multiplicationModel = document.getElementById(
    "multiplication-model-toggle"
  );

  openCloseNavButton.addEventListener("click", () => {
    if (sideNav.dataset.state === "open") {
      sideNav.dataset.state = "closed";
    } else sideNav.dataset.state = "open";
    console.log(sideNav.dataset.state);
  });

  function generateMultiplicationModel() {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    let factor1 = {};
    const factor2 = {};
    if (multiplicationModel.checked) {
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

      toScaleLabel.style.setProperty("display", "flex");
      showBorderLabel.style.setProperty("display", "none");
      factor2Fraction.style.setProperty("display", "flex");
      factorLabels.forEach((label) => {
        label.style.display = "none";
      });
      let toScale = document.getElementById("to-scale-checkbox").checked;

      multiplicationSVG.innerHTML = "";
      multiplicationSVG.setAttribute(
        "width",
        Math.min(800, window.innerWidth * 0.8)
      );
      mathVisual.fractionMultiplicationAreaModel(
        multiplicationSVG,
        factor1,
        factor2,
        (lineThickness = 5),
        (colorFill = "hsla(188, 37%, 51%,70%)"),
        (colorFill2 = "hsla(96, 70%, 66%,50%)"),
        toScale
      );
    } else {
      toScaleLabel.style.setProperty("display", "none");
      showBorderLabel.style.setProperty("display", "flex");
      factor2Fraction.style.setProperty("display", "none");
      factorLabels.forEach((label) => {
        label.style.display = "grid";
      });
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

      let toScale = document.getElementById("to-scale-checkbox").checked;

      mathVisual.fractionMultiplicationGroupModel(
        multiplicationSVG,
        factor1,
        factor2,
        (lineThickness = 5),
        (colorFill = "#54a4b0"),
        toScale
      );
    }
  }

  generateMultiplicationButton.addEventListener("click", function () {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    multiplicationSVG.innerHTML = "";
    multiplicationSVG.setAttribute(
      "width",
      Math.min(800, window.innerWidth * 0.8)
    );
    generateMultiplicationModel();
  });

  const downloadMultiplicationSVG = document.getElementById("mult-svg-button");
  const downloadMultiplicationPNG = document.getElementById("mult-png-button");
  const copyPngButton = document.getElementById("mult-copy-button");
  const toScaleCheck = document.getElementById("to-scale-checkbox");

  multiplicationModel.addEventListener("change", () => {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    multiplicationSVG.innerHTML = "";
    multiplicationSVG.setAttribute(
      "width",
      Math.min(800, window.innerWidth * 0.8)
    );
    generateMultiplicationModel();
  });

  toScaleCheck.addEventListener("change", function () {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    multiplicationSVG.innerHTML = "";
    multiplicationSVG.setAttribute(
      "width",
      Math.min(800, window.innerWidth * 0.8)
    );
    generateMultiplicationModel();
  });
  downloadMultiplicationSVG.addEventListener("click", function () {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    downloadSvg(multiplicationSVG);
  });

  downloadMultiplicationPNG.addEventListener("click", function () {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    downloadPng(multiplicationSVG);
  });
  copyPngButton.addEventListener("click", function () {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    copyPngToClipboard(multiplicationSVG);
    showCopiedVerification(copyPngButton);
  });
}

function divisionFrac() {
  // HTML Elements from the Division page
  const generateDivisionButton = document.getElementById("generate-division");
  const modelToggle = document.getElementById("division-model-toggle");
  const divisionSVG = document.getElementById("division-svg");
  divisionSVG.innerHTML = "";
  let width = 800;
  let height = 250;
  let lineThickness = 5;
  let lineColor = "#000000";
  let colorArray = ["#52a4b0", "#b7dd82", "#f0a68c", "#f5ef84", "#928183"];
  const divisionModelCheckbox = document.getElementById(
    "divisor-is-larger-checkbox"
  );
  const divisorLargerInputs = document.getElementById("divisor-larger");
  const divisorSmallerInputs = document.getElementById("divisor-smaller");

  let openCloseNavButton = document.querySelector(".corner-logo");
  let sideNav = document.querySelector(".side-nav");

  openCloseNavButton.addEventListener("click", () => {
    if (sideNav.dataset.state === "open") {
      sideNav.dataset.state = "closed";
    } else sideNav.dataset.state = "open";
    console.log(sideNav.dataset.state);
  });

  divisionModelCheckbox.addEventListener("change", function () {
    divisionSVG.innerHTML = "";
    if (divisionModelCheckbox.checked) {
      divisorLargerInputs.style.visibility = "visible";
      divisorSmallerInputs.style.visibility = "hidden";
    } else {
      divisorLargerInputs.style.visibility = "hidden";
      divisorSmallerInputs.style.visibility = "visible";
    }
  });

  function generateDivisionModel(divisionSVG) {
    if (!divisionModelCheckbox.checked) {
      let dividend = {};
      let divisor = {};
      dividend.wholeNum = parseInt(
        document.getElementById("division-whole-number1").value
      );
      let numeratorPlaceholder = document.getElementById(
        "division-numerator1"
      ).value;
      if (numeratorPlaceholder == "") {
        numeratorPlaceholder = 0;
      }
      dividend.numerator = parseInt(numeratorPlaceholder);
      dividend.denominator = parseInt(
        document.getElementById("division-denominator1").value
      );
      divisor.numerator = parseInt(
        document.getElementById("division-numerator2").value
      );
      divisor.denominator = parseInt(
        document.getElementById("division-denominator2").value
      );
      divisionSVG.innerHTML = "";
      divisionSVG.setAttribute(
        "width",
        Math.min(width, window.innerWidth * 0.8)
      );
      if (modelToggle.checked) {
        mathVisual.fractionDivisionBar(
          divisionSVG,
          dividend,
          divisor,
          lineThickness,
          colorArray[0],
          colorArray[1],
          lineColor
        );
      } else {
        mathVisual.fractionDivisionCircles(
          divisionSVG,
          dividend,
          divisor,
          lineThickness,
          colorArray,
          lineColor
        );
      }
    } else {
      let dividend = {};
      let divisor = {};
      dividend.numerator = parseInt(
        document.getElementById("dividend-numerator").value
      );
      dividend.denominator = parseInt(
        document.getElementById("dividend-denominator").value
      );
      divisor.wholeNum = parseInt(
        document.getElementById("divisor-whole-number").value
      );
      if (modelToggle.checked) {
        mathVisual.fractionDivisionOneBar(
          divisionSVG,
          dividend,
          divisor,
          lineThickness,
          colorArray[0],
          lineColor
        );
      } else {
        mathVisual.fractionDivisionOneCircle(
          divisionSVG,
          dividend,
          divisor,
          lineThickness,
          colorArray[0],
          lineColor
        );
      }
    }
  }

  generateDivisionButton.addEventListener("click", function () {
    const divisionSVG = document.getElementById("division-svg");
    divisionSVG.innerHTML = "";
    divisionSVG.setAttribute("width", Math.min(width, window.innerWidth * 0.8));
    generateDivisionModel(divisionSVG);
  });

  let saveSettingsButton = document.getElementById("save-button");
  saveSettingsButton.addEventListener("click", () => {
    let customizations = saveSettings(divisionSVG, 5);
    colorArray = customizations.colors;
    lineThickness = customizations.lineThickness;
    width = customizations.width;
    height = customizations.height;
    lineColor = customizations.borderColor;
    divisionSVG.innerHTML = "";
    divisionSVG.setAttribute("width", Math.min(width, window.innerWidth * 0.8));
    generateDivisionModel(divisionSVG);
  });

  let cancelSettingsButton = document.getElementById("cancel-button");
  cancelSettingsButton.addEventListener("click", () => {
    revertSettings(color, lineThickness, width, height, borderColor);
  });

  const divisionPngButton = document.getElementById("division-png-button");
  divisionPngButton.addEventListener("click", function () {
    const divisionSVG = document.getElementById("division-svg");
    downloadPng(divisionSVG);
  });

  const downloadDivisionSVG = document.getElementById("division-svg-button");
  downloadDivisionSVG.addEventListener("click", function () {
    const divisionSVG = document.getElementById("division-svg");
    downloadSvg(divisionSVG);
  });

  const copyPngButton = document.getElementById("division-copy-button");
  copyPngButton.addEventListener("click", function () {
    const divisionSVG = document.getElementById("division-svg");
    copyPngToClipboard(divisionSVG);
    showCopiedVerification(copyPngButton);
  });

  modelToggle.addEventListener("change", () => {
    const divisionSVG = document.getElementById("division-svg");
    divisionSVG.innerHTML = "";
    divisionSVG.setAttribute("width", Math.min(width, window.innerWidth * 0.8));
    generateDivisionModel(divisionSVG);
  });
}

function index() {
  // function logoScript() {
  //   let logoSVG = document.getElementById("logo-svg");
  //   const downloadLogoSVG = document.getElementById("logo-svg-button");
  // }

  let modal = document.getElementById("screen-size-modal");
  let closeModal = document.getElementById("screen-size-warning-button");

  const mediaQuery = window.matchMedia("(max-width: 600px)");

  function handleScreenChange(e) {
    if (e.matches) {
      // Screen width is 600px or less
      modal.showModal();
    }
  }

  // function handleResize() {
  //   if (window.innerWidth <= 600) {
  //     modal.showModal();
  //   }
  // }

  // mediaQuery.addEventListener(handleScreenChange);
  // handleScreenChange(mediaQuery);

  function handleScreenChange() {
    if (mediaQuery.matches) {
      modal.showModal();
    }
  }

  handleScreenChange();

  // window.addEventListener("resize", handleResize);

  closeModal.addEventListener("click", () => {
    modal.close();
    console.log("Success!");
  });
}

function buttonFunctions() {
  let openCloseNavButton = document.getElementById("expand-collapse-nav");
  let sideNav = document.querySelector(".side-nav");
  let widthInput = document.getElementById("width-input");
  let heightInput = document.getElementById("height-input");
  let warning = document.getElementById("max-size-warning");

  openCloseNavButton.addEventListener("click", () => {
    if (sideNav.dataset.state === "open") {
      sideNav.dataset.state = "closed";
    } else sideNav.dataset.state = "open";
  });

  widthInput.addEventListener("change", () => {
    if (widthInput.value > 1200) {
      widthInput.value = 800;
      warning.style.fontWeight = "bold";
      setTimeout(() => {
        warning.style.fontWeight = "normal";
      }, 2000);
    } else if (widthInput.value < 0) {
      widthInput.value = 0;
    }
  });

  heightInput.addEventListener("change", () => {
    if (heightInput.value > 1200) {
      heightInput.value = 250;
      setTimeout(() => {
        warning.style.fontWeight = "normal";
      }, 2000);
    } else if (heightInput.value < 0) {
      heightInput.value = 0;
    }
  });
}
