// HTML Elements from the Division page
const generateDivisionButton = document.getElementById('generate-division');
const modelToggle = document.getElementById('division-model-toggle');
const divisionSVG = document.getElementById('division-svg');
divisionSVG.innerHTML = '';
let attributes = {};
let width = 800;
let height = 250;
attributes.lineThickness = 5;
attributes.lineColor = '#000000';
attributes.colorArray = ['#52a4b0', '#b7dd82', '#f0a68c', '#f5ef84', '#928183'];
attributes.minNumColors = 3;
const divisionModelCheckbox = document.getElementById(
  'divisor-is-larger-checkbox'
);
const divisorLargerInputs = document.getElementById('divisor-larger');
const divisorSmallerInputs = document.getElementById('divisor-smaller');

let openCloseNavButton = document.querySelector('.corner-logo');
let sideNav = document.querySelector('.side-nav');
let colorInputs = document.querySelectorAll(`input[type="color"]`);
let colorNote = document.getElementById('color-note');
let numColors;

function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const regex = /([^&=]+)=([^&]*)/g;
  let m;

  while ((m = regex.exec(queryString))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  return params;
}

function preFillForm() {
  const params = getUrlParams();

  for (const key in params) {
    const input = document.getElementById(key);
    if (input) {
      input.value = params[key];
    }
  }

  if (params['division-model-toggle'] === 'true') {
    document.getElementById('division-model-toggle').checked = true;
  } else {
    document.getElementById('division-model-toggle').checked = false;
  }

  if (params['divisor-is-larger-checkbox'] === 'true') {
    document.getElementById('divisor-is-larger-checkbox').checked = true;
  } else {
    document.getElementById('divisor-is-larger-checkbox').checked = false;
  }

  if (params.submit === 'true') {
    handleSubmit(event);
  }
}

window.onload = preFillForm;

function handleSubmit(event) {
  event.preventDefault();
  const divisionSVG = document.getElementById('division-svg');
  divisionSVG.innerHTML = '';
  divisionSVG.setAttribute('width', Math.min(width, window.innerWidth * 0.8));
  generateDivisionModel(divisionSVG);
}

openCloseNavButton.addEventListener('click', () => {
  if (sideNav.dataset.state === 'open') {
    sideNav.dataset.state = 'closed';
  } else sideNav.dataset.state = 'open';
  console.log(sideNav.dataset.state);
});

divisionModelCheckbox.addEventListener('change', function () {
  divisionSVG.innerHTML = '';
  if (divisionModelCheckbox.checked) {
    divisorLargerInputs.style.visibility = 'visible';
    divisorSmallerInputs.style.visibility = 'hidden';
    for (let i = 2; i < 5; i++) {
      colorInputs[i].dataset.extra = 'true';
    }
    colorNote.style.display = 'none';
    numColors = 2;
    colorInputs[1].value = '#cdcdcd';
    attributes.colorArray[1] = '#cdcdcd';
  } else {
    for (let i = 2; i < 5; i++) {
      colorInputs[i].dataset.extra = 'false';
    }
    colorNote.style.display = 'block';
    numColors = 5;
    colorInputs[1].value = '#b7dd82';
    attributes.colorArray[1] = '#b7dd82';
    divisorLargerInputs.style.visibility = 'hidden';
    divisorSmallerInputs.style.visibility = 'visible';
  }
});

function generateDivisionModel(divisionSVG) {
  if (!divisionModelCheckbox.checked) {
    let dividend = {};
    let divisor = {};

    dividend.wholeNum = parseInt(
      document.getElementById('division-whole-number1').value
    );
    let numeratorPlaceholder = document.getElementById(
      'division-numerator1'
    ).value;
    if (numeratorPlaceholder == '') {
      numeratorPlaceholder = 0;
    }
    dividend.numerator = parseInt(numeratorPlaceholder);
    dividend.denominator = parseInt(
      document.getElementById('division-denominator1').value
    );
    divisor.numerator = parseInt(
      document.getElementById('division-numerator2').value
    );
    divisor.denominator = parseInt(
      document.getElementById('division-denominator2').value
    );
    divisionSVG.innerHTML = '';
    divisionSVG.setAttribute('width', Math.min(width, window.innerWidth * 0.8));
    if (modelToggle.checked) {
      mathVisual.fractionDivisionBar(
        divisionSVG,
        dividend,
        divisor,
        attributes
      );
    } else {
      mathVisual.fractionDivisionCircles(
        divisionSVG,
        dividend,
        divisor,
        attributes
      );
    }
  } else {
    // if divisor is larger
    let dividend = {};
    let divisor = {};
    divisorLargerInputs.style.visibility = 'visible';
    divisorSmallerInputs.style.visibility = 'hidden';
    for (let i = 2; i < 5; i++) {
      colorInputs[i].dataset.extra = 'true';
    }
    colorNote.style.display = 'none';
    numColors = 2;
    colorInputs[1].value = '#cdcdcd';
    attributes.colorArray[1] = '#cdcdcd';

    dividend.numerator = parseInt(
      document.getElementById('dividend-numerator').value
    );
    dividend.denominator = parseInt(
      document.getElementById('dividend-denominator').value
    );
    divisor.wholeNum = parseInt(
      document.getElementById('divisor-whole-number').value
    );
    if (modelToggle.checked) {
      mathVisual.fractionDivisionOneBar(
        divisionSVG,
        dividend,
        divisor,
        attributes
      );
    } else {
      mathVisual.fractionDivisionOneCircle(
        divisionSVG,
        dividend,
        divisor,
        attributes
      );
    }
  }
}

// generateDivisionButton.addEventListener('click', function () {
//   const divisionSVG = document.getElementById('division-svg');
//   divisionSVG.innerHTML = '';
//   divisionSVG.setAttribute('width', Math.min(width, window.innerWidth * 0.8));
//   generateDivisionModel(divisionSVG);
// });

let saveSettingsButton = document.getElementById('save-button');
saveSettingsButton.addEventListener('click', () => {
  let customizations = {};
  if (divisionModelCheckbox.checked) {
    numColors = 2;
  } else {
    numColors = 5;
  }
  customizations = saveSettings(divisionSVG, numColors);
  attributes.colorArray = customizations.colors;
  attributes.lineThickness = customizations.lineThickness;
  width = customizations.width;
  height = customizations.height;
  attributes.lineColor = customizations.borderColor;
  divisionSVG.innerHTML = '';
  divisionSVG.setAttribute('width', Math.min(width, window.innerWidth * 0.8));
  generateDivisionModel(divisionSVG);
});

let cancelSettingsButton = document.getElementById('cancel-button');
cancelSettingsButton.addEventListener('click', () => {
  revertSettings(
    attributes.colorArray,
    numColors,
    attributes.lineThickness,
    width,
    height,
    attributes.lineColor
  );
});

const divisionPngButton = document.getElementById('division-png-button');
divisionPngButton.addEventListener('click', function () {
  const divisionSVG = document.getElementById('division-svg');
  downloadPng(divisionSVG);
});

const downloadDivisionSVG = document.getElementById('division-svg-button');
downloadDivisionSVG.addEventListener('click', function () {
  const divisionSVG = document.getElementById('division-svg');
  downloadSvg(divisionSVG);
});

const copyPngButton = document.getElementById('division-copy-button');
copyPngButton.addEventListener('click', function () {
  const divisionSVG = document.getElementById('division-svg');
  copyPngToClipboard(divisionSVG);
  showCopiedVerification(copyPngButton);
});

modelToggle.addEventListener('change', () => {
  const divisionSVG = document.getElementById('division-svg');
  divisionSVG.innerHTML = '';
  divisionSVG.setAttribute('width', Math.min(width, window.innerWidth * 0.8));
  generateDivisionModel(divisionSVG);
});
