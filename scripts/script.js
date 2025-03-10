// Global Functions
const mathVisual = {};
// I made angleWherePiecesStart a global variable because I may change it later or make it customizable by the user. It means the circles will start shading at 270 degrees going counterclockwise. This is for fraction division circles so that if there are a few pieces that go in the same group as some in the next circle, they are closer together.
angleWherePiecesStart = Math.PI * 0.5;

function showCopiedVerification(copyButton) {
  copyButton.dataset.copied = 'true';
  copyButton.innerHTML = 'Copied!';
  setTimeout(function () {
    copyButton.dataset.copied = 'false';
    copyButton.innerHTML = 'Copy PNG';
  }, 5000);
}

function saveSettings(svg, numColors) {
  let customizations = {};
  customizations.colors = [];
  for (let i = 0; i < numColors; i++) {
    customizations.colors[i] = document.getElementById(`color${i + 1}`).value;
  }
  console.log(customizations.colors);
  customizations.borderColor = document.getElementById('border-color').value;
  let width = document.getElementById('width-input').value;
  let height = document.getElementById('height-input').value;
  customizations.lineThickness =
    document.getElementById('thickness-slider').value;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  customizations.width = width;
  customizations.height = height;
  opacityElement = document.getElementById('opacity-slider');
  if (opacityElement) {
    customizations.opacity = opacityElement.value;
  }
  return customizations;
}

function revertSettings(
  colorArray,
  numColors,
  lineThickness,
  width,
  height,
  borderColor
) {
  for (let i = 0; i < numColors; i++) {
    document.getElementById(`color${i + 1}`).value = colorArray[i];
  }
  document.getElementById('thickness-slider').value = lineThickness;
  document.getElementById('width-input').value = width;
  document.getElementById('height-input').value = height;
  document.getElementById('border-color').value = borderColor;
}

function buttonFunctions() {
  let openCloseNavButton = document.getElementById('expand-collapse-nav');
  let sideNav = document.querySelector('.side-nav');

  openCloseNavButton.addEventListener('click', () => {
    if (sideNav.dataset.state === 'open') {
      sideNav.dataset.state = 'closed';
    } else sideNav.dataset.state = 'open';
  });
}

function settingsModal() {
  let widthInput = document.getElementById('width-input');
  let heightInput = document.getElementById('height-input');
  let warning = document.getElementById('max-size-warning');
  widthInput.addEventListener('change', () => {
    if (widthInput.value > 1200) {
      widthInput.value = 800;
      warning.style.fontWeight = 'bold';
      setTimeout(() => {
        warning.style.fontWeight = 'normal';
      }, 2000);
    } else if (widthInput.value < 0) {
      widthInput.value = 0;
    }
  });

  heightInput.addEventListener('change', () => {
    if (heightInput.value > 1200) {
      heightInput.value = 250;
      setTimeout(() => {
        warning.style.fontWeight = 'normal';
      }, 2000);
    } else if (heightInput.value < 0) {
      heightInput.value = 0;
    }
  });
}

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

  if (params['basic-model-toggle'] === 'true') {
    document.getElementById('basic-model-toggle').checked = true; // Check the checkbox
  } else {
    document.getElementById('basic-model-toggle').checked = false; // Uncheck the checkbox if needed
  }

  if (params.submit === 'true') {
    handleSubmit(event);
  }
}

window.onload = preFillForm;
