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

// Given a width and height of a container and a number of roughly-square items to fit inside of the container, this function returns the optimal size of each item so that they will all fit and use as much of the available space as possible. If you want the items to be spaced out, multiply the width and height parameters by a scale factor less than one.
function calculateOptimalDimensions(width, height, numItems) {
  /**
   * For example, given a width of 900 pixels and a height of 300 pixels, the aspect ratio would be 3 (900 / 300).
   * If we wanted to fit say 100 items in this 900 by 300 container, multiplying 100 by the aspect ratio allows us to consider how to evenly distribute 300 (100*3) items within a 900 by 900 pixel square.
   * This can easily be done by taking the square root of 300 (triple the number of items we actually need)
   * to determine that we need a little over 17 items to go in each row.
   * In order to avoid overflow in the horizontal direction, I used Math.floor() method which will force the items per row to be 17.
   *
   * Since we actually only need 100 items in a 900 by 300 pixel container, we can calculate the number of rows needed with 100 / 17.
   * This results in 5.88 which really means we need 6 rows but the last row will not be filled, which is why I used Math.ceil().
   *
   * Since our container has an aspect ratio of 900:300, simplified 3:1, the ratio of itemsPerRow : numRows should be as close as possible to this ratio, but prioritizing making sure all items fully fit inside.
   *
   */
  let optimalDimensions = {};
  let aspectRatio = width / height;

  // Multiplying by numItems by the apsect ratio essentially makes it a square full of items with the side lengths equal to the width in pixels. Then taking the square root allows us to figure out how many items to line up in each row in order to distribute them equally.

  let itemsPerRow = Math.floor(Math.sqrt(numItems * aspectRatio)); // How many elements should be put in each row
  let numRows = Math.ceil(numItems / itemsPerRow);

  let itemSize = Math.min(width / itemsPerRow, height / numRows);

  optimalDimensions.size = itemSize;
  optimalDimensions.itemsPerRow = itemsPerRow;
  optimalDimensions.numRows = numRows;
  return optimalDimensions;
}

function alternateBetweenColors(current, color1, color2, color3) {
  if (current == color1) {
    current = color2;
  } else if (current == color2) {
    current = color3;
  } else {
    current = color1;
  }
  return current;
}

function shadeFractionSlices(
  canvas,
  x,
  y,
  radius,
  numerator,
  denominator,
  lineThickness,
  colorFill,
  startAngle = 0
) {
  // const startAngle = 0; // starting angle (in radians)
  const angle = startAngle + (Math.PI * 2) / denominator;

  let shaded = angle * numerator;
  canvas.beginPath(); // Filling in the shaded pieces
  canvas.lineWidth = lineThickness;
  canvas.arc(x, y, radius, startAngle, shaded);
  canvas.lineTo(x, y);
  // I've only drawn an arc and one line, but when the fill() method is called, the canvas will automatically draw a line back to the starting point. So I do not need to explicitly create the 3rd line to close the path to be filled.
  canvas.fillStyle = colorFill;
  canvas.fill();
  canvas.closePath();
}

function makeFractionLines(canvas, x, y, radius, denominator) {
  const angle = (Math.PI * 2) / denominator;
  let currentAngle = angle;
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
  wholeNum,
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
  wholeNum,
  numerator,
  denominator,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)"
) => {
  if (numerator < 0 || denominator < 0) {
    return alert(`Please enter a positive numerator and denominator.`);
  } else if (numerator > denominator || wholeNum > 0) {
    mathVisual.mixedNumCircles(
      canvasElement,
      wholeNum,
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
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)"
) => {
  const width = canvasElement.width;
  const height = canvasElement.height;
  let canvas = canvasElement.getContext("2d");
  canvas.clearRect(0, 0, width, height);

  canvas.fillStyle = "white";
  canvas.fillRect(0, 0, width, height);

  canvas.strokeStyle = "gray";
  canvas.strokeRect(0, 0, width, height);
  // Figure out how long the radius of each circle should be based on the canvas dimensions.
  let numWholes = Math.floor(numerator / denominator);
  let maxWholes = 0; // This is how many circles will be drawn on the canvas

  if (numerator % denominator == 0) {
    maxWholes = numWholes + wholeNum;
  } else {
    maxWholes = numWholes + wholeNum + 1;
  } // Determines how many total circles will be drawn even if the last one is only partially shaded

  let horizontalSpacing = 0;
  let verticalSpacing = 0;
  let circlesPerLine = maxWholes;
  let numLines = 1;

  if (maxWholes <= 4) {
    // If there are only four or less circles this puts them all on one line because it looks silly otherwise.
    numLines = 1;
    circlesPerLine = maxWholes;
    radius = Math.min((width * 0.8) / maxWholes / 2, (height * 0.8) / 2);
    console.log(`radius is ${radius}`);
  } else {
    optimalDimensions = calculateOptimalDimensions(
      width * 0.8,
      height * 0.8,
      maxWholes
    ); // Multiplying by 0.8 to leave room for spacing.
    circlesPerLine = optimalDimensions.itemsPerRow;
    numLines = optimalDimensions.numRows;
    radius = optimalDimensions.size / 2;
  }

  horizontalSpacing = (width - circlesPerLine * radius * 2) / circlesPerLine;

  verticalSpacing = (height - numLines * radius * 2) / (numLines + 1);

  let currentX = radius + horizontalSpacing / 2;
  let currentY = radius + verticalSpacing;
  let slicesLeft = numerator;
  let currentWhole = 1;
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

    if (currentWhole <= wholeNum) {
      canvas.beginPath();
      canvas.fillStyle = colorFill;
      canvas.lineWidth = lineThickness;
      canvas.arc(currentX, currentY, radius, 0, 2 * Math.PI);
      canvas.fill();
      currentWhole = currentWhole + 1;
    } else {
      shadeFractionSlices(
        canvas,
        currentX,
        currentY,
        radius,
        slicesLeft,
        denominator,
        lineThickness,
        colorFill
      );

      makeFractionLines(canvas, currentX, currentY, radius, denominator);

      slicesLeft = slicesLeft - denominator;
    }
    currentX = currentX + 2 * radius + horizontalSpacing; // Move to next circle
  }

  let modelInfo = {};
  modelInfo.horizontalSpacing = horizontalSpacing;
  modelInfo.verticalSpacing = verticalSpacing;
  modelInfo.radius = radius;
  modelInfo.canvas = canvas;
  return modelInfo;
};

// This function is not done yet.
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

// This function is not done yet.
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

mathVisual.fractionDivisionBar = (
  canvasElement,
  wholeNum1,
  numerator1,
  denominator1,
  numerator2,
  denominator2,
  lineThickness = 4,
  colorFill = "#347d88",
  colorFill2 = " #9de56c",
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

// This function is almost done!
mathVisual.fractionDivisionCircles = (
  canvasElement,
  wholeNum1,
  numerator1,
  denominator1,
  numerator2,
  denominator2,
  lineThickness = 4,
  colorFill = "#52a4b0", // teal
  colorFill2 = "#f0a68c", // peach
  colorFill3 = "#9de56c" // light green
) => {
  // mixedNumCircles will draw the dividend.
  let info = mathVisual.mixedNumCircles(
    canvasElement,
    wholeNum1,
    numerator1,
    denominator1,
    5,
    "gray"
  );
  canvas = info.canvas;
  radius = info.radius;
  horizontalSpacing = info.horizontalSpacing;
  verticalSpacing = info.verticalSpacing;

  currentX = radius + horizontalSpacing / 2;
  currentY = radius + verticalSpacing;
  startAngle = 0;
  let color = colorFill;
  let width = canvasElement.width;

  let slicesToBeFilled = Math.floor(
    wholeNum1 * denominator2 +
      (numerator1 / denominator1 / (numerator2 / denominator2)) * numerator2
  );
  let quotientFloor = Math.floor(slicesToBeFilled / numerator2);
  console.log(
    `Slices to be filled is ${slicesToBeFilled}, quotientFloor is ${quotientFloor}`
  );

  let currentPieceOfNumerator = 0;
  let currentPieceOfDenominator = 0;
  for (let i = 0; i < slicesToBeFilled; i++) {
    if (currentPieceOfNumerator >= numerator2) {
      color = alternateBetweenColors(color, colorFill, colorFill2, colorFill3);
      currentPieceOfNumerator = 0;
      if (currentPieceOfDenominator >= denominator2) {
        makeFractionLines(canvas, currentX, currentY, radius, denominator2);
        currentX = currentX + radius * 2 + horizontalSpacing;
        if (currentX + radius >= width) {
          currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the second line if we run out of space
          currentX = radius + horizontalSpacing / 2;
        }
        startAngle = 0;
        currentPieceOfDenominator = 0;
        debugger;
      } else {
        startAngle = startAngle + (1 / denominator2) * Math.PI * 2;
        debugger;
      }
    } else {
      if (currentPieceOfDenominator >= denominator2) {
        makeFractionLines(canvas, currentX, currentY, radius, denominator2);
        currentX = currentX + radius * 2 + horizontalSpacing;
        if (currentX + radius >= width) {
          currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the second line if we run out of space
          currentX = radius + horizontalSpacing / 2;
        }
        startAngle = 0;
        currentPieceOfDenominator = 0;
        debugger;
      } else {
        startAngle = startAngle + (1 / denominator2) * Math.PI * 2;
        debugger;
      }
    }

    shadeFractionSlices(
      canvas,
      currentX,
      currentY,
      radius,
      1,
      denominator2,
      lineThickness,
      color,
      startAngle
    );

    console.log(
      `currentPieceOfNum is ${currentPieceOfNumerator} and currentPieceOfDenom is ${currentPieceOfDenominator}`
    );
    debugger;
    currentPieceOfNumerator++;
    currentPieceOfDenominator++;
  }
  makeFractionLines(canvas, currentX, currentY, radius, denominator2);
};
