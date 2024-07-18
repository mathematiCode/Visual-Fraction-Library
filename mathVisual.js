const mathVisual = {};

function drawCircle(svg, x, y, radius, lineThickness, color = "black") {
  const svgNS = svg.namespaceURI;
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("stroke", color);
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke-width", lineThickness);
  svg.appendChild(circle);
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

function switchBetweenColors(current, color1, color2, color3) {
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
  svg,
  x,
  y,
  radius,
  numerator,
  denominator,
  lineThickness,
  colorFill,
  startAngle = Math.PI
) {
  const svgNS = svg.namespaceURI;
  const angle = startAngle + (Math.PI * 2) / denominator;
  let previousAngle = startAngle;
  let currentAngle = angle;
  for (let i = 0; i < numerator; i++) {
    const curvedPath = document.createElementNS(svgNS, "path");
    const startX = x + radius * Math.cos(previousAngle);
    const startY = y + radius * Math.sin(previousAngle);
    const endX = x + radius * Math.cos(currentAngle);
    const endY = y + radius * Math.sin(currentAngle);
    curvedPath.setAttribute("fill", colorFill);
    curvedPath.setAttribute(
      "d",
      `
    M ${x},${y} 
    L ${startX},${startY} 
    A ${radius},${radius} 0 0 1 ${endX},${endY} 
    Z
  `
    );
    previousAngle = currentAngle;
    currentAngle = currentAngle + angle;
    svg.appendChild(curvedPath);
  }
}

function makeFractionLines(svg, x, y, radius, denominator, lineThickness) {
  const angle = (Math.PI * 2) / denominator;
  let currentAngle = Math.PI;

  for (let i = 0; i < denominator; i++) {
    const svgNS = svg.namespaceURI;
    const line = document.createElementNS(svgNS, "line");
    const startX = x + radius * Math.cos(currentAngle);
    const startY = y + radius * Math.sin(currentAngle);
    const endX = x;
    const endY = y;

    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", lineThickness);
    svg.appendChild(line);

    currentAngle += angle;
  }
}

function drawFractionBar(
  svg,
  x,
  y,
  width,
  height,
  numerator,
  denominator,
  lineThickness,
  colorFill
) {
  const svgNS = svg.namespaceURI;
  const interval = width / denominator;
  let separator = interval; // Need two variables becuase separator will increment while interval stays constant.

  let shaded = interval * numerator;
  console.log(`Shaded is ${shaded}`);

  const shadedRect = document.createElementNS(svgNS, "rect");
  shadedRect.setAttribute("x", x + lineThickness);
  shadedRect.setAttribute("y", y);
  shadedRect.setAttribute("width", shaded - lineThickness);
  shadedRect.setAttribute("height", height);
  shadedRect.setAttribute("fill", colorFill);
  shadedRect.setAttribute("stroke", "black");
  shadedRect.setAttribute("stroke-width", 0);
  svg.appendChild(shadedRect);

  for (let i = 1; i < denominator; i++) {
    const pieceSeparator = document.createElementNS(svgNS, "line");
    pieceSeparator.setAttribute("x1", x + separator);
    pieceSeparator.setAttribute("y1", y);
    pieceSeparator.setAttribute("x2", x + separator);
    pieceSeparator.setAttribute("y2", y + height);
    pieceSeparator.setAttribute("stroke", "black");
    pieceSeparator.setAttribute("stroke-width", lineThickness);
    svg.appendChild(pieceSeparator);
    separator = separator + interval;
  }

  const blackBorder = document.createElementNS(svgNS, "rect");
  blackBorder.setAttribute("x", x + lineThickness);
  blackBorder.setAttribute("y", y);
  blackBorder.setAttribute("width", width);
  blackBorder.setAttribute("height", height);
  blackBorder.setAttribute("fill", "none");
  blackBorder.setAttribute("stroke", "black");
  blackBorder.setAttribute("stroke-width", lineThickness);
  svg.appendChild(blackBorder);
}

mathVisual.fractionBar = (
  svg,
  wholeNum,
  numerator,
  denominator,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)"
) => {
  const width = svg.getAttribute("width") - lineThickness - 5;
  const height = svg.getAttribute("height") - lineThickness - 5;
  const svgNS = svg.namespaceURI;

  if (numerator > denominator) {
    return alert(
      `Please enter a proper fraction. num=${numerator} denom=${denominator} ${
        numerator > denominator
      }`
    );
  } else if (wholeNum > 0) {
    mathVisual.mixedNumBars(
      svg,
      wholeNum,
      numerator,
      denominator,
      lineThickness,
      colorFill
    );
  } else {
    drawFractionBar(
      svg,
      lineThickness,
      lineThickness,
      width,
      height,
      numerator,
      denominator,
      lineThickness,
      colorFill
    );
  }
};

mathVisual.fractionCircle = (
  svg,
  wholeNum,
  numerator,
  denominator,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)"
) => {
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  console.log(`The width of the svg is ${width}`);
  if (numerator < 0 || denominator < 0) {
    return alert(`Please enter a positive numerator and denominator.`);
  } else if (numerator > denominator || wholeNum > 0) {
    mathVisual.mixedNumCircles(
      svg,
      wholeNum,
      numerator,
      denominator,
      lineThickness,
      colorFill
    );

    return;
  }

  // Set the circle properties
  const x = width / 2; // x-coordinate of the center
  const y = height / 2; // y-coordinate of the center
  let radius = 0;
  if (width <= height) {
    radius = width / 2;
  } else {
    radius = height / 2;
  }

  drawCircle(svg, x, y, radius - 5, lineThickness); // Draws the outer circle

  shadeFractionSlices(
    svg,
    x,
    y,
    radius - lineThickness / 2 - 5,
    numerator,
    denominator,
    lineThickness,
    colorFill,
    0
  ); // Shades in the fraction portion and draws lines to show each slice
  makeFractionLines(svg, x, y, radius - 5, denominator);
};

mathVisual.mixedNumCircles = (
  svg,
  wholeNum,
  numerator,
  denominator,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)"
) => {
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  const svgNS = svg.namespaceURI;
  // Figure out how long the radius of each circle should be based on the svg dimensions.
  let numWholes = Math.floor(numerator / denominator);
  let maxWholes = 0; // This is how many circles will be drawn on the svg

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
      currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the next line if we run out of space
      currentX = radius + horizontalSpacing / 2;
    }
    const wholeCircle = document.createElementNS(svgNS, "circle");

    drawCircle(svg, currentX, currentY, radius, lineThickness);

    if (currentWhole <= wholeNum) {
      wholeCircle.setAttribute("cx", currentX);
      wholeCircle.setAttribute("cy", currentY);
      wholeCircle.setAttribute("r", radius - lineThickness / 2);
      wholeCircle.setAttribute("stroke", "none");
      wholeCircle.setAttribute("fill", colorFill);
      svg.appendChild(wholeCircle);
      currentWhole = currentWhole + 1;
    } else {
      shadeFractionSlices(
        svg,
        currentX,
        currentY,
        radius - lineThickness / 2,
        slicesLeft,
        denominator,
        lineThickness,
        colorFill
      );

      makeFractionLines(
        svg,
        currentX,
        currentY,
        radius,
        denominator,
        lineThickness
      );

      slicesLeft = slicesLeft - denominator;
    }
    currentX = currentX + 2 * radius + horizontalSpacing; // Move to next circle
  }
  // Returns this object of info to be used later in the fractionDivisionCircles function.
  let modelInfo = {};
  modelInfo.horizontalSpacing = horizontalSpacing;
  modelInfo.verticalSpacing = verticalSpacing;
  modelInfo.radius = radius;
  modelInfo.svg = svg;
  return modelInfo;
};

// This function is not done yet.
mathVisual.mixedNumBars = (
  svg,
  wholeNum,
  numerator,
  denominator,
  lineThickness,
  colorFill
) => {
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  const svgNS = svg.namespaceURI;

  let numWholes = Math.floor(numerator / denominator);
  let maxWholes = 0; // This is how many bars will be drawn on the svg

  if (numerator % denominator == 0) {
    maxWholes = numWholes + wholeNum;
  } else {
    maxWholes = numWholes + wholeNum + 1;
  } // Determines how many total bars will be drawn even if the last one is only partially shaded

  let horizontalSpacing = 0;
  let verticalSpacing = 0;
  let circlesPerLine = maxWholes;
  let numLines = 1;

  if (maxWholes <= 7) {
    // If there are only four or less bars this puts them all on one line because it looks silly otherwise.
    numLines = 1;
    barsPerLine = maxWholes;
    barWidth = (width * 0.9) / maxWholes;
    barHeight = height * 0.8;
  } else {
    optimalDimensions = calculateOptimalDimensions(
      width * 0.9,
      height * 0.8,
      maxWholes
    ); // Multiplying by 0.8 to leave room for spacing.
    barsPerLine = optimalDimensions.itemsPerRow;
    numLines = optimalDimensions.numRows;
    barWidth = optimalDimensions.size;
    barHeight = optimalDimensions.size;
  }

  horizontalSpacing = (width - barsPerLine * barWidth) / barsPerLine;

  verticalSpacing = (height - numLines * barHeight) / (numLines + 1);

  let currentX = horizontalSpacing / 2;
  let currentY = verticalSpacing;
  let currentWhole = 1;

  // Draws the bars and shades in the correct # of slices given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    if (currentX + barWidth >= width) {
      currentY = currentY + barHeight + verticalSpacing; // Moves the remaining bars to the next line if we run out of space
      currentX = horizontalSpacing / 2;
    }
    const wholeBar = document.createElementNS(svgNS, "rect");

    if (currentWhole <= wholeNum) {
      wholeBar.setAttribute("x", currentX);
      wholeBar.setAttribute("y", currentY);
      wholeBar.setAttribute("width", barWidth);
      wholeBar.setAttribute("height", barHeight);
      wholeBar.setAttribute("stroke", "black");
      wholeBar.setAttribute("stroke-width", lineThickness);
      wholeBar.setAttribute("fill", colorFill);
      svg.appendChild(wholeBar);
      currentWhole = currentWhole + 1;
    } else {
      drawFractionBar(
        svg,
        currentX,
        currentY,
        barWidth,
        barHeight,
        numerator,
        denominator,
        lineThickness,
        colorFill
      );
    }
    currentX = currentX + barWidth + horizontalSpacing; // Move to next bar
  }
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
  svg,
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
  const spaceForLabels = 50;
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height") - spaceForLabels;
  const svgNS = svg.namespaceURI;
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
  } // unit: pixels

  let segmenter; // This represents how big the divisor is in pixels relative to the divident
  if (wholeNum1 == 0) {
    segmenter = (width / denominator2) * numerator2;
  } else {
    segmenter = (interval / denominator2) * numerator2;
  }

  let numSegments = ((wholeNum1 + 1) * denominator2) / numerator2 + 1;

  //color each section alternating colors
  for (let i = 1; i <= numSegments; i++) {
    const section = document.createElementNS(svgNS, "rect");
    if (i % 2 == 0) {
      section.setAttribute("fill", colorFill2);
    } else {
      section.setAttribute("fill", colorFill);
    }

    section.setAttribute("x", segmenter * i - segmenter);
    section.setAttribute("y", 0);
    section.setAttribute("width", segmenter);
    section.setAttribute("height", height);
    svg.appendChild(section);

    // Covers up any shading that may have overflowed beyond the dividend
    const whiteBackground = document.createElementNS(svgNS, "rect");
    whiteBackground.setAttribute("fill", "white");
    whiteBackground.setAttribute("x", dividend);
    whiteBackground.setAttribute("y", 0);
    whiteBackground.setAttribute("width", width - dividend);
    whiteBackground.setAttribute("height", height);
    svg.appendChild(whiteBackground);

    // Dashed border which is invisible if the dividend is a whole number but shows the next integer up if the dividend is a mixed number
    const dottedRect = document.createElementNS(svgNS, "rect");
    dottedRect.setAttribute("x", lineThickness);
    dottedRect.setAttribute("y", lineThickness);
    dottedRect.setAttribute("width", width - lineThickness * 2);
    dottedRect.setAttribute("height", height);
    dottedRect.setAttribute("fill", "none");
    dottedRect.setAttribute("stroke", "black");
    dottedRect.setAttribute("stroke-width", lineThickness * 2);
    dottedRect.setAttribute("stroke-dasharray", "5, 6"); // dash pattern: 5 units dash, 6 units gap
    svg.appendChild(dottedRect);

    // Create dashed lines to segment each iteration of the divisor
    const dottedLine = document.createElementNS(svgNS, "line");
    dottedLine.setAttribute("x1", segmenter * i);
    dottedLine.setAttribute("y1", 0);
    dottedLine.setAttribute("x2", segmenter * i);
    dottedLine.setAttribute("y2", height);
    dottedLine.setAttribute("stroke", "black");
    dottedLine.setAttribute("stroke-width", lineThickness + 2);
    dottedLine.setAttribute("stroke-dasharray", "5, 5"); // dash pattern: 5 units dash, 10 units gap
    svg.appendChild(dottedLine);
  }

  // Create solid separators for each whole OR if the dividend is less than one, for each portion
  for (let i = 1; i < numSections; i++) {
    const boldLine = document.createElementNS(svgNS, "line");
    boldLine.setAttribute("stroke-dasharray", "none");
    boldLine.setAttribute("stroke", "black");
    boldLine.setAttribute("x1", separator);
    boldLine.setAttribute("y1", 0);
    boldLine.setAttribute("x2", separator);
    boldLine.setAttribute("y2", height);
    if (wholeNum1 != 0) {
      boldLine.setAttribute("stroke-width", lineThickness * 2);
    } else {
      boldLine.setAttribute("stroke-width", lineThickness * 2);
    }
    separator = separator + interval;
    svg.appendChild(boldLine);
  }

  // thin unit fraction lines
  let unitFractionWidth;
  if (wholeNum1 == 0) {
    unitFractionWidth = width / denominator2;
  } else {
    unitFractionWidth = width / (numSections * denominator2);
  }
  let unitFracDivider = unitFractionWidth;

  for (let i = 1; i < numSections * denominator2; i++) {
    const thinLine = document.createElementNS(svgNS, "line");
    thinLine.setAttribute("stroke-width", lineThickness / 2);
    thinLine.setAttribute("stroke", "black");
    thinLine.setAttribute("x1", unitFracDivider);
    thinLine.setAttribute("y1", lineThickness);
    thinLine.setAttribute("x2", unitFracDivider);
    thinLine.setAttribute("y2", height);
    svg.appendChild(thinLine);
    unitFracDivider = unitFracDivider + unitFractionWidth;
  }

  // Create solid black outline
  const blackOutline = document.createElementNS(svgNS, "rect");
  blackOutline.setAttribute("stroke-width", lineThickness * 2);
  blackOutline.setAttribute("fill", "none");
  blackOutline.setAttribute("stroke", "black");
  blackOutline.setAttribute("x", lineThickness);
  blackOutline.setAttribute("y", lineThickness);
  blackOutline.setAttribute("width", dividend);
  blackOutline.setAttribute("height", height);
  svg.appendChild(blackOutline);
};

// This function is almost done! I just need to handle the last piece if only a partial group or piece can be drawn.
mathVisual.fractionDivisionCircles = (
  svg,
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
    svg,
    wholeNum1,
    numerator1,
    denominator1,
    lineThickness,
    "gray"
  );
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  radius = info.radius;
  horizontalSpacing = info.horizontalSpacing;
  verticalSpacing = info.verticalSpacing;
  currentX = radius + horizontalSpacing / 2;
  currentY = radius + verticalSpacing;
  startAngle = 0;
  let color = colorFill;
  let slicesToBeFilled = Math.floor(
    wholeNum1 * denominator2 +
      (numerator1 / denominator1 / (numerator2 / denominator2)) * numerator2
  );
  // let quotientFloor = Math.floor(slicesToBeFilled / numerator2);
  // console.log(
  //   `Slices to be filled is ${slicesToBeFilled}, quotientFloor is ${quotientFloor}`
  // );

  let currentPieceOfNumerator = 0;
  let currentPieceOfDenominator = 0;
  for (let i = 0; i < slicesToBeFilled; i++) {
    if (currentPieceOfNumerator >= numerator2) {
      color = switchBetweenColors(color, colorFill, colorFill2, colorFill3);
      currentPieceOfNumerator = 0;
      if (currentPieceOfDenominator >= denominator2) {
        makeFractionLines(
          svg,
          currentX,
          currentY,
          radius,
          denominator2,
          lineThickness
        );
        currentX = currentX + radius * 2 + horizontalSpacing;
        if (currentX + radius >= width) {
          currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the next line if we run out of space
          currentX = radius + horizontalSpacing / 2;
          startAngle = Math.PI;
        }

        currentPieceOfDenominator = 0;
      } else {
        startAngle = startAngle + (1 / denominator2) * Math.PI * 2;
      }
    } else {
      if (currentPieceOfDenominator >= denominator2) {
        makeFractionLines(
          svg,
          currentX,
          currentY,
          radius,
          denominator2,
          lineThickness
        );
        currentX = currentX + radius * 2 + horizontalSpacing;
        if (currentX + radius >= width) {
          currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the next line if we run out of space
          currentX = radius + horizontalSpacing / 2;
          startAngle = Math.PI;
        }

        currentPieceOfDenominator = 0;
      } else {
        startAngle = startAngle + (1 / denominator2) * Math.PI * 2;
      }
    }
    shadeFractionSlices(
      svg,
      currentX,
      currentY,
      radius - lineThickness / 2,
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

  makeFractionLines(
    svg,
    currentX,
    currentY,
    radius,
    denominator2,
    lineThickness
  );
};
