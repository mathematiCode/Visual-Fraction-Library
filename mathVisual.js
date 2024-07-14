const mathVisual = {};

function drawCircle(canvas, x, y, radius, lineThickness, color = "black") {
  const startAngle = 0; // starting angle (in radians)
  const endAngle = 2 * Math.PI; // ending angle (in radians)

  canvas.beginPath();
  canvas.strokeStyle = color;
  canvas.lineWidth = lineThickness;
  canvas.arc(x, y, radius, startAngle, endAngle); // Drawing the outer circle
  canvas.stroke();
  canvas.closePath();
}

function makeFractionSlices(
  canvas,
  x,
  y,
  radius,
  numerator,
  denominator,
  colorFill
) {
  const startAngle = 0; // starting angle (in radians)
  const angle = (Math.PI * 2) / denominator;
  let currentAngle = angle;
  let shaded = angle * numerator;
  canvas.beginPath(); // Filling in the shaded pieces
  canvas.arc(x, y, radius, startAngle, shaded);
  canvas.lineTo(x, y);
  // I've only drawn an arc and one line, but when the fill() method is called, the canvas will automatically draw a line back to the starting point. So I do not need to explicitly create the 3rd line to close the path to be filled.
  canvas.fillStyle = colorFill;
  canvas.fill();
  canvas.closePath();

  for (i = 0; i < denominator; i++) {
    // Creating lines for each slice
    canvas.beginPath();
    canvas.arc(x, y, radius, currentAngle, currentAngle + angle);
    canvas.lineTo(x, y);
    currentAngle = currentAngle + angle;
    canvas.stroke();
  }
}

mathVisual.fractionBar = (
  canvasElement,
  numerator,
  denominator,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)"
) => {
  let canvas = canvasElement.getContext("2d");
  const width = canvasElement.width;
  const height = canvasElement.height;

  if (numerator > denominator) {
    return alert(
      `Please enter a proper fraction. num=${numerator} denom=${denominator} ${
        numerator > denominator
      }`
    );
  }
  canvas.clearRect(0, 0, width, height);
  const interval = width / denominator;
  let separator = interval; // Need two variables becuase separator will increment while interval stays constant.

  let shaded = interval * numerator;
  canvas.fillStyle = "white";
  canvas.fillRect(
    lineThickness,
    lineThickness,
    width - lineThickness * 2,
    height - lineThickness * 2
  );
  canvas.fillStyle = colorFill;
  canvas.fillRect(
    lineThickness,
    lineThickness,
    shaded - lineThickness,
    height - lineThickness
  );

  for (let i = 1; i < denominator; i++) {
    canvas.beginPath();
    canvas.moveTo(separator, 0);
    canvas.lineTo(separator, height);
    canvas.closePath();
    canvas.lineWidth = lineThickness;
    canvas.stroke();
    separator = separator + interval;
  }
  canvas.lineWidth = lineThickness * 2;
  canvas.fillStyle = "black";
  canvas.strokeRect(0, 0, width, height);
};

mathVisual.fractionCircle = (
  canvasElement,
  numerator,
  denominator,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)"
) => {
  if (numerator < 0 || denominator < 0) {
    return alert(`Please enter a positive numerator and denominator.`);
  } else if (numerator > denominator) {
    mathVisual.mixedNumCircles(
      canvasElement,
      0,
      numerator,
      denominator,
      lineThickness,
      colorFill
    );
    return;
  }

  const width = canvasElement.width;
  const height = canvasElement.height;
  let canvas = canvasElement.getContext("2d");
  canvas.clearRect(0, 0, width, height);

  // Set the circle properties
  const x = width / 2; // x-coordinate of the center
  const y = height / 2; // y-coordinate of the center
  let radius = 0;
  if (width <= height) {
    radius = width / 2;
  } else {
    radius = height / 2;
  }

  drawCircle(canvas, x, y, radius, lineThickness); // Draws the outer circle

  makeFractionSlices(canvas, x, y, radius, numerator, denominator, colorFill); // Shades in the fraction portion and draws lines to show each slice
};

mathVisual.mixedNumCircles = (
  canvasElement,
  wholeNum,
  numerator,
  denominator,
  lineThickness,
  colorFill
) => {
  const width = canvasElement.width;
  const height = canvasElement.height;
  let canvas = canvasElement.getContext("2d");
  canvas.clearRect(0, 0, width, height);

  canvas.fillStyle = "pink";
  canvas.fillRect(0, 0, width, height);

  // Figure out how long the radius of each circle should be based on the canvas dimensions.
  let numWholes = Math.floor(numerator / denominator); //
  let maxWholes = 0; // This is how many circles will be drawn on the canvas

  if (numerator % denominator == 0) {
    maxWholes = numWholes + wholeNum;
  } else {
    maxWholes = numWholes + wholeNum + 1;
  } // Determines how many total circles will be drawn even if the last one is only partially shaded
  let radius = 0;
  let numLines = 1; // Defaults to one line of circles
  let horizontalSpacing = 0;
  let verticalSpacing = 0;

  function findMaxRadius(width, height, maxWholes, numLines = 1) {
    console.log(`numWholes is ${numWholes}`);

    let aspectRatio = width / height;

    let circlesPerLine = Math.floor(Math.sqrt(maxWholes * aspectRatio));
    numLines = Math.ceil(maxWholes / circlesPerLine);

    console.log(`aspectRatio is ${aspectRatio}`);
    console.log(`maxWholes*aspectRatio is ${maxWholes * aspectRatio}`);
    console.log(`circlesPerLine is ${circlesPerLine}`);
    console.log(`numLines is ${numLines}`);
    radius = Math.min(
      (0.8 * width) / circlesPerLine / 2,
      (0.8 * height) / numLines / 2
    );
    console.log(
      `width / circlesPerLine/2 is ${
        width / circlesPerLine / 2
      }  The radius is ${radius}`
    );

    horizontalSpacing = (width - circlesPerLine * radius * 2) / circlesPerLine;

    verticalSpacing = (height - numLines * radius * 2) / (numLines + 1);
  }

  findMaxRadius(width, height, maxWholes);

  let currentX = radius + horizontalSpacing / 2;
  let currentY = radius + verticalSpacing;
  let currentLine = 1;
  let slicesLeft = numerator;
  if (radius < 20 || (radius < 35 && denominator > 10) || denominator > 15) {
    lineThickness = lineThickness / 2;
  }

  // Draws the circles and shades in the correct # of slices given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    if (currentX + radius >= width) {
      currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the second line if we run out of space
      currentX = radius + horizontalSpacing / 2;
    }

    drawCircle(canvas, currentX, currentY, radius, lineThickness);
    makeFractionSlices(
      canvas,
      currentX,
      currentY,
      radius,
      slicesLeft,
      denominator,
      colorFill
    ); // Shades in the fraction portion and draws lines to show each slice
    slicesLeft = slicesLeft - denominator;
    currentX = currentX + 2 * radius + horizontalSpacing;
  }
};

mathVisual.mixedNumBars = (
  canvasElement,
  wholeNum = 0,
  numerator,
  denominator,
  lineThickness,
  colorFill
) => {
  const width = canvasElement.width;
  const height = canvasElement.height;
  let canvas = canvasElement.getContext("2d");
  canvas.clearRect(0, 0, width, height);
};

mathVisual.fractionMultiplication = (
  canvasElement,
  wholeNum1,
  numerator1,
  denominator1,
  wholeNum2,
  numerator2,
  denominator2,
  style = "area"
) => {
  let canvas = canvasElement.getContext("2d");
  const width = canvasElement.width;
  const height = canvasElement.height;
  canvas.clearRect(0, 0, width, height);

  if (wholeNum1 === 0 && wholeNum2 === 0) {
  }
};

mathVisual.fractionDivision = (
  canvasElement,
  wholeNum1,
  numerator1,
  denominator1,
  numerator2,
  denominator2,
  lineThickness = 4,
  colorFill = "#52a4b0",
  colorFill2 = "#f0a68c",
  style = "bar"
) => {
  let canvas = canvasElement.getContext("2d");
  const width = canvasElement.width;
  const spaceForLabels = 50;
  const height = canvasElement.height - spaceForLabels;
  canvas.clearRect(0, 0, width, height + spaceForLabels);
  let numSections = 0; //

  // Need to add error handling for decimal, blank or negative inputs

  if (!wholeNum1) {
    wholeNum1 = 0;
  } // If the wholeNum input is blank, the variable is set to 0.

  if (
    wholeNum1 < 0 ||
    numerator1 < 0 ||
    denominator1 < 0 ||
    numerator2 < 0 ||
    denominator2 < 0
  ) {
    return alert(
      `Please enter a positive number in each box or leave it blank.`
    );
  } else if (wholeNum1 == 0 && numerator1 == 0) {
    return alert(`Please enter a positive dividend.`);
  } else if (denominator1 == 0 || denominator2 == 0) {
    return alert(`All denominators must be positive.`);
  } else if (wholeNum1 == 0) {
    numSections = denominator1;
  } else if (numerator1 == 0) {
    numSections = wholeNum1;
  } else {
    numSections = wholeNum1 + 1;
  }

  const interval = width / numSections;
  let separator = interval;
  let dividend = 0;

  if (!numerator1) {
    numerator1 = 0;
  }

  if (wholeNum1 == 0) {
    dividend = interval * numerator1;
  } else {
    dividend = interval * wholeNum1 + (interval / denominator1) * numerator1;
  } // unit: canvas pixels

  // Removing this code from here for now to put it closer to the end so these lines display above the colored sections. I'm leaving here because I may add it back later if I want to have an animation that shows the original dividend and then counts by divisors one at a time.

  //   canvas.beginPath();
  //   canvas.fillStyle = "gray";
  //   canvas.fillRect(
  //     lineThickness,
  //     lineThickness,
  //     dividend - lineThickness * 2,
  //     height - lineThickness * 2
  //   );
  //   canvas.closePath();
  //   canvas.stroke();

  //   for (let i = 1; i < numSections; i++) {
  //     canvas.beginPath();
  //     canvas.moveTo(separator, 0);
  //     canvas.lineTo(separator, height);
  //     canvas.closePath();
  //     canvas.lineWidth = lineThickness;
  //     canvas.stroke();
  //     separator = separator + interval;
  //   }

  let segmenter; // This represents how big the divisor is in pixels relative to the divident
  if (wholeNum1 == 0) {
    segmenter = (width / denominator2) * numerator2;
  } else {
    segmenter = (interval / denominator2) * numerator2;
  }

  let numSegments = ((wholeNum1 + 1) * denominator2) / numerator2 + 1;

  //color each section alternating colors
  for (let i = 1; i <= numSegments; i++) {
    if (i % 2 == 0) {
      canvas.fillStyle = colorFill2;
      canvas.fillRect(segmenter * i - segmenter, 0, segmenter * i, height);
    } else {
      canvas.fillStyle = colorFill;
      canvas.fillRect(segmenter * i - segmenter, 0, segmenter * i, height);
    }

    canvas.fillStyle = "white";
    canvas.fillRect(dividend, 0, width, height);

    // Dashed border which is invisible if the dividend is a whole number but shows the next integer up if the dividend is a mixed number
    canvas.fillStyle = "black";
    canvas.setLineDash([5, 6]);
    canvas.lineWidth = lineThickness * 2;
    canvas.beginPath();
    canvas.moveTo(lineThickness, lineThickness);
    canvas.lineTo(lineThickness, height + lineThickness);
    canvas.lineTo(width - lineThickness, height + lineThickness);
    canvas.lineTo(width - lineThickness, lineThickness);
    canvas.lineTo(lineThickness, lineThickness);
    canvas.stroke();

    // Create dashed lines to segment each iteration of the divisor
    canvas.setLineDash([5, 10]);
    // canvas.fillStyle = colorFill;
    canvas.lineWidth = lineThickness + 1;
    canvas.beginPath();
    canvas.moveTo(segmenter * i, 0);
    canvas.lineTo(segmenter * i, height);
    canvas.closePath();
    canvas.stroke();
  }

  canvas.setLineDash([]);
  // Create solid separators for each whole OR if the dividend is less than one, for each portion
  for (let i = 1; i < numSections; i++) {
    canvas.beginPath();
    canvas.moveTo(separator, 0);
    canvas.lineTo(separator, height);
    canvas.closePath();
    if (wholeNum1 != 0) {
      canvas.lineWidth = lineThickness * 2;
    } else {
      canvas.lineWidth = lineThickness;
    }
    canvas.stroke();
    separator = separator + interval;
  }

  // thin unit fraction lines
  let unitFractionWidth;
  if (wholeNum1 == 0) {
    unitFractionWidth = width / denominator2;
  } else {
    unitFractionWidth = width / (numSections * denominator2);
  }
  let unitFracDivider = unitFractionWidth;
  canvas.setLineDash([]);
  canvas.strokeStyle = "black";
  for (let i = 1; i < numSections * denominator2; i++) {
    canvas.lineWidth = lineThickness / 4;
    canvas.beginPath();
    canvas.moveTo(unitFracDivider, lineThickness);
    canvas.lineTo(unitFracDivider, height);
    canvas.stroke();
    unitFracDivider = unitFracDivider + unitFractionWidth;
  }

  // Create solid black outline
  canvas.setLineDash([]); // Resets the line to solid instead of dashed
  canvas.strokeStyle = "black";
  canvas.lineWidth = lineThickness * 2;
  canvas.strokeRect(lineThickness, lineThickness, dividend, height);
};
