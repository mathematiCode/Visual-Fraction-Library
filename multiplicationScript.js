// HTML Elements from the Multiplication page
const generateMultiplicationButton = document.getElementById(
  "generate-multiplication"
);
let attributes = {};
attributes.lineColor = "#000000";
attributes.colorArray = ["#52a4b0", "#9ce56c"];
attributes.lineThickness = 5;
attributes.borderIsShowing = false; // for groups only
attributes.toScale = false; //for area model only
width = 800;
height = 250;
attributes.opacity1 = 0.5;
attributes.opacity2 = 0.5;

let openCloseNavButton = document.querySelector(".corner-logo");
let sideNav = document.querySelector(".side-nav");
let toScaleLabel = document.getElementById("to-scale-label");
let showBorderLabel = document.getElementById("show-border-label");
const factorLabels = document.querySelectorAll(".factor-label");
const factor2Fraction = document.getElementById("factor2-fraction");
const multiplicationSVG = document.getElementById("multiplication-svg");

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
    attributes.toScale = document.getElementById("to-scale-checkbox").checked;

    multiplicationSVG.innerHTML = "";
    multiplicationSVG.setAttribute(
      "width",
      Math.min(width, window.innerWidth * 0.8)
    );

    mathVisual.fractionMultiplicationAreaModel(
      multiplicationSVG,
      factor1,
      factor2,
      attributes
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

    attributes.borderIsShowing =
      document.getElementById("to-scale-checkbox").checked;

    mathVisual.fractionMultiplicationGroupModel(
      multiplicationSVG,
      factor1,
      factor2,
      attributes
    );
  }
}

let saveSettingsButton = document.getElementById("save-button");
saveSettingsButton.addEventListener("click", () => {
  let customizations = saveSettings(multiplicationSVG, 2);
  attributes.colorArray = customizations.colors;
  attributes.lineThickness = customizations.lineThickness;
  width = customizations.width;
  height = customizations.height;
  attributes.lineColor = customizations.borderColor;
  attributes.opacity1 = customizations.opacity;
  attributes.opacity2 = customizations.opacity;
  multiplicationSVG.innerHTML = "";
  generateMultiplicationModel();
});

generateMultiplicationButton.addEventListener("click", function () {
  const multiplicationSVG = document.getElementById("multiplication-svg");
  multiplicationSVG.innerHTML = "";
  multiplicationSVG.setAttribute(
    "width",
    Math.min(width, window.innerWidth * 0.8)
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
    Math.min(width, window.innerWidth * 0.8)
  );
  generateMultiplicationModel();
});

toScaleCheck.addEventListener("change", function () {
  const multiplicationSVG = document.getElementById("multiplication-svg");
  multiplicationSVG.innerHTML = "";
  multiplicationSVG.setAttribute(
    "width",
    Math.min(width, window.innerWidth * 0.8)
  );
  multiplicationSVG.setAttribute(
    "height",
    Math.min(height, window.innerWidth * 0.6)
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
