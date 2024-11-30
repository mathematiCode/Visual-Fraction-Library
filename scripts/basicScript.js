// HTML Elements from the basic fraction page
const generateBasicButton = document.getElementById("generate-basic");
const modelToggle = document.getElementById("basic-model-toggle");
const basicSVG = document.getElementById("basic-svg");
let mixedNum = {};
let attributes = {};
attributes.fillColor = ["#52a4b0"];
attributes.lineThickness = 5;
attributes.width = 800;
attributes.height = 250;
attributes.borderColor = "black";

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
  basicSVG.setAttribute(
    "width",
    Math.min(attributes.width, window.innerWidth * 0.8)
  );
  if (modelToggle.checked) {
    mathVisual.fractionBar(basicSVG, mixedNum, attributes);
  } else {
    mathVisual.fractionCircle(basicSVG, mixedNum, attributes);
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
  basicSVG.setAttribute(
    "width",
    Math.min(attributes.width, window.innerWidth * 0.8)
  );
  if (modelToggle.checked) {
    mathVisual.fractionBar(
      basicSVG,
      mixedNum,
      attributes,
      attributes.lineThickness,
      attributes.fillColor,
      attributes.borderColor
    );
  } else {
    mathVisual.fractionCircle(
      basicSVG,
      mixedNum,
      attributes,
      attributes.lineThickness,
      attributes.fillColor,
      attributes.borderColor
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
  attributes = saveSettings(basicSVG, 1);
  attributes.fillColor = attributes.colors[0];
  //   color = customizations.colors[0];
  //   lineThickness = customizations.lineThickness;
  //   width = customizations.width;
  //   height = customizations.height;
  //   borderColor = customizations.borderColor;
  basicSVG.innerHTML = "";
  if (modelToggle.checked) {
    mathVisual.fractionBar(basicSVG, mixedNum, attributes);
  } else {
    mathVisual.fractionCircle(basicSVG, mixedNum, attributes);
  }
});

let cancelSettingsButton = document.getElementById("cancel-button");
cancelSettingsButton.addEventListener("click", () => {
  revertSettings(
    attributes.fillColor,
    1,
    attributes.lineThickness,
    attributes.width,
    attributes.height,
    attributes.borderColor
  );
});
