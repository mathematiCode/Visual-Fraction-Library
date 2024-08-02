// Global Functions
const mathVisual = {};
// I made angleWherePiecesStart a global variable because I may change it later or make it customizable by the user. It means the circles will start shading at 270 degrees going counterclockwise. This is for fraction division circles so that if there are a few pieces that go in the same group as some in the next circle, they are closer together.
angleWherePiecesStart = Math.PI * 0.5;

function basicFrac() {
  // HTML Elements from the basic fraction page
  const generateBasicButton = document.getElementById("generate-basic");
  const modelToggle = document.getElementById("basic-model-toggle");
  const basicSVG = document.getElementById("basic-svg");
  let mixedNum = {};

  let openCloseNavButton = document.querySelector(".corner-logo");
  let sideNav = document.querySelector(".side-nav");

  openCloseNavButton.addEventListener("click", () => {
    if (sideNav.dataset.state === "open") {
      sideNav.dataset.state = "closed";
    } else sideNav.dataset.state = "open";
    console.log(sideNav.dataset.state);
  });

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
    if (modelToggle.checked) {
      mathVisual.fractionBar(basicSVG, mixedNum);
    } else {
      mathVisual.fractionCircle(basicSVG, mixedNum);
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
    if (modelToggle.checked) {
      mathVisual.fractionBar(basicSVG, mixedNum);
    } else {
      mathVisual.fractionCircle(basicSVG, mixedNum);
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
  });
}

function multiplicationFrac() {
  // HTML Elements from the Multiplication page
  const generateMultiplicationButton = document.getElementById(
    "generate-multiplication"
  );

  let openCloseNavButton = document.querySelector(".corner-logo");
  let sideNav = document.querySelector(".side-nav");
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

      let toScale = document.getElementById("to-scale-checkbox").checked;

      multiplicationSVG.innerHTML = "";
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
    }
  }

  generateMultiplicationButton.addEventListener("click", function () {
    generateMultiplicationModel();
  });

  const downloadMultiplicationSVG = document.getElementById("mult-svg-button");
  const downloadMultiplicationPNG = document.getElementById("mult-png-button");
  const copyPngButton = document.getElementById("mult-copy-button");
  const toScaleCheck = document.getElementById("to-scale-checkbox");

  toScaleCheck.addEventListener("change", function () {
    const multiplicationSVG = document.getElementById("multiplication-svg");
    multiplicationSVG.innerHTML = "";
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
  });
}

function divisionFrac() {
  // HTML Elements from the Division page
  const generateDivisionButton = document.getElementById("generate-division");
  const modelToggle = document.getElementById("division-model-toggle");
  const divisionSVG = document.getElementById("division-svg");
  divisionSVG.innerHTML = "";
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
      dividend.numerator = parseInt(
        document.getElementById("division-numerator1").value
      );
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
      if (modelToggle.checked) {
        mathVisual.fractionDivisionBar(divisionSVG, dividend, divisor);
      } else {
        mathVisual.fractionDivisionCircles(
          divisionSVG,
          dividend,
          divisor,
          (lineThickness = 5),
          (colorFill = "#52a4b0"),
          (colorFill2 = "#f0a68c")
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
          (lineThickness = 5),
          (colorFill = "#52a4b0")
        );
      } else {
        mathVisual.fractionDivisionOneCircle(
          divisionSVG,
          dividend,
          divisor,
          (lineThickness = 5),
          (colorFill = "#52a4b0")
        );
      }
    }
  }

  generateDivisionButton.addEventListener("click", function () {
    const divisionSVG = document.getElementById("division-svg");
    divisionSVG.innerHTML = "";
    generateDivisionModel(divisionSVG);
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
  });

  modelToggle.addEventListener("change", () => {
    const divisionSVG = document.getElementById("division-svg");
    divisionSVG.innerHTML = "";
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
  let openCloseNavButton = document.querySelector(".corner-logo");
  let sideNav = document.querySelector(".side-nav");

  openCloseNavButton.addEventListener("click", () => {
    if (sideNav.dataset.state === "open") {
      sideNav.dataset.state = "closed";
    } else sideNav.dataset.state = "open";
    console.log(sideNav.dataset.state);
  });
}
