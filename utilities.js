function downloadPng(svgEl) {
  if (svgEl instanceof Node) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgXml = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgXml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get the canvas data as a PNG-encoded string
      const pngData = canvas.toDataURL("image/png");

      // Create a link to download the PNG file
      const a = document.createElement("a");
      a.href = pngData;
      a.download = "my-image.png";
      a.click();

      URL.revokeObjectURL(url);
    };
    img.src = url;
    img.onerror = function () {
      console.error("Failed to load image");
    };
  } else {
    console.error("The object is not a node");
  }
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

function drawCircle(
  svg,
  x,
  y,
  radius,
  lineThickness,
  lineColor = "black",
  fillColor = "none"
) {
  const svgNS = svg.namespaceURI;
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("stroke", lineColor);
  circle.setAttribute("fill", fillColor);
  circle.setAttribute("stroke-width", lineThickness);
  svg.appendChild(circle);
}

// Given a width and height of a container and a number of roughly-square items to fit inside of the container, this function returns the optimal size of each item so that they will all fit and use as much of the available space as possible.
function calculateOptimalDimensions(width, height, numItems) {
  /**
   * For example, given a width of 900 pixels and a height of 300 pixels, the aspect ratio would be 3 (900 / 300).
   * If we wanted to fit say 100 items in a 900 by 300 container, multiplying 100 by the aspect ratio allows us to consider how to evenly distribute 300 (100*3) items within a 900 by 900 pixel square.
   * This can easily be done by taking the square root of 300 (triple the number of items we actually need)
   * to determine that we need a little over 17 items to go in each row.
   * In order to avoid overflow in the horizontal direction, I used Math.floor() method which will force the items per row to be 17.
   *
   * Since we actually only need 100 items in a 900 by 300 pixel container, we can calculate the number of rows needed with 100 / 17.
   * This results in 5.88 which really means we need 6 rows but the last row will not be filled, which is why I used Math.ceil().
   *
   * Since our container has an aspect ratio of 900:300, simplified 3:1, the ratio of itemsPerRow : numRows should be as close as possible to this ratio, but the function will prioritize making sure all items fully fit inside.
   *
   * If you want the items to be spaced out, multiply the width and height parameters by a scale factor less than one.
   *
   */
  let optimalDimensions = {};
  let aspectRatio = width / height;

  let itemsPerRow = Math.floor(Math.sqrt(numItems * aspectRatio));
  let numRows = Math.ceil(numItems / itemsPerRow);

  let spacesAvailableInLastRow = itemsPerRow * numRows - numItems;
  let itemsInLastRow = itemsPerRow - spacesAvailableInLastRow;
  if (itemsInLastRow <= numRows - 1) {
    itemsPerRow++;
    numRows--;
  } else if (numRows <= spacesAvailableInLastRow) {
    itemsPerRow--;
  }

  let itemSize = Math.min(width / itemsPerRow, height / numRows);

  optimalDimensions.size = itemSize;
  optimalDimensions.itemsPerRow = itemsPerRow;
  optimalDimensions.numRows = numRows;
  return optimalDimensions;
}

function isFactor1GreaterThanOrEqualToFactor2(factor1, factor2) {
  if (factor1.wholeNum > factor2.wholeNum) {
    return true;
  } else if (factor2.wholeNum > factor1.wholeNum) {
    return false;
  } else if (
    factor1.numerator / factor1.denominator >=
    factor2.numerator / factor2.denominator
  ) {
    return true;
  }
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
  startAngle = angleWherePiecesStart
) {
  const svgNS = svg.namespaceURI;
  const angle = (Math.PI * 2) / denominator;
  let previousAngle = startAngle;
  let currentAngle = startAngle + angle;

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
    currentAngle += angle;
    svg.appendChild(curvedPath);
  }
}

function makeFractionLines(
  svg,
  x,
  y,
  radius,
  denominator,
  lineThickness,
  startAngle = angleWherePiecesStart
) {
  const angle = (Math.PI * 2) / denominator;
  let currentAngle = startAngle;

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

function drawAndShadeGroups(
  svg,
  currentX,
  currentY,
  width,
  radius,
  slicesToBeFilled,
  numerator2,
  denominator2,
  lineThickness,
  horizontalSpacing,
  verticalSpacing,
  startAngle,
  color,
  colorFill,
  colorFill2,
  colorFill3
) {
  let currentPieceOfNumerator = 0;
  let currentPieceOfDenominator = 0;

  for (let i = 0; i < slicesToBeFilled; i++) {
    if (i == 0) {
      startAngle = angleWherePiecesStart;
    } else if (currentPieceOfDenominator >= denominator2) {
      // If circle is fully shaded, draws the lines and moves to the next circle
      makeFractionLines(
        svg,
        currentX,
        currentY,
        radius,
        denominator2,
        lineThickness,
        startAngle
      );
      currentX = currentX + radius * 2 + horizontalSpacing;
      startAngle = angleWherePiecesStart;
      currentPieceOfDenominator = 0;
      if (currentX + radius >= width) {
        // Moves the remaining circles to the next line if we run out of space
        currentY = currentY + radius * 2 + verticalSpacing;
        currentX = radius + horizontalSpacing / 2;
      }
    } else {
      // if there are still pieces left to shade on the current circle
      startAngle += (1 / denominator2) * Math.PI * 2;
    }

    if (currentPieceOfNumerator >= numerator2) {
      color = switchBetweenColors(color, colorFill, colorFill2, colorFill3);
      currentPieceOfNumerator = 1;
    } else {
      currentPieceOfNumerator++;
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

    currentPieceOfDenominator++;
  }

  // Creates lines for the last circle that may not have gotten lines drawn if it wasn't filled.
  makeFractionLines(
    svg,
    currentX,
    currentY,
    radius,
    denominator2,
    lineThickness,
    startAngle
  );
}

function drawVerticalFractionBar(
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

  const shadedRect = document.createElementNS(svgNS, "rect");
  shadedRect.setAttribute("x", x + lineThickness);
  shadedRect.setAttribute("y", y);
  shadedRect.setAttribute("width", shaded);
  shadedRect.setAttribute("height", height);
  shadedRect.setAttribute("fill", colorFill);
  shadedRect.setAttribute("stroke", "black");
  shadedRect.setAttribute("stroke-width", 0);
  svg.appendChild(shadedRect);

  for (let i = 1; i < denominator; i++) {
    const pieceSeparator = document.createElementNS(svgNS, "line");
    pieceSeparator.setAttribute("x1", x + separator + lineThickness);
    pieceSeparator.setAttribute("y1", y);
    pieceSeparator.setAttribute("x2", x + separator + lineThickness);
    pieceSeparator.setAttribute("y2", y + height);
    pieceSeparator.setAttribute("stroke", "black");
    pieceSeparator.setAttribute("stroke-width", lineThickness * 0.7);
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

function drawHorizontalFractionBar(
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
  const interval = height / denominator;
  let separator = interval; // Need two variables becuase separator will increment while interval stays constant.

  let shaded = interval * numerator;

  const shadedRect = document.createElementNS(svgNS, "rect");
  shadedRect.setAttribute("x", x + lineThickness);
  shadedRect.setAttribute("y", y);
  shadedRect.setAttribute("width", width);
  shadedRect.setAttribute("height", shaded);
  shadedRect.setAttribute("fill", colorFill);
  shadedRect.setAttribute("stroke", "black");
  shadedRect.setAttribute("stroke-width", 0);
  svg.appendChild(shadedRect);

  for (let i = 1; i < denominator; i++) {
    const pieceSeparator = document.createElementNS(svgNS, "line");
    pieceSeparator.setAttribute("x1", x + lineThickness);
    pieceSeparator.setAttribute("y1", y + separator);
    pieceSeparator.setAttribute("x2", x + width + lineThickness);
    pieceSeparator.setAttribute("y2", y + separator);
    pieceSeparator.setAttribute("stroke", "black");
    pieceSeparator.setAttribute("stroke-width", lineThickness * 0.7);
    svg.appendChild(pieceSeparator);
    separator = separator + interval;
  }

  const blackBorder = document.createElementNS(svgNS, "rect");
  blackBorder.setAttribute("x", x + lineThickness);
  blackBorder.setAttribute("y", y + lineThickness / 2);
  blackBorder.setAttribute("width", width);
  blackBorder.setAttribute("height", height - lineThickness);
  blackBorder.setAttribute("fill", "none");
  blackBorder.setAttribute("stroke", "black");
  blackBorder.setAttribute("stroke-width", lineThickness);
  svg.appendChild(blackBorder);
}

function mixedNumCircles(
  svg,
  wholeNum,
  numerator,
  denominator,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)",
  width,
  height,
  startX = 0,
  startY = 0
) {
  // const width = svg.getAttribute("width");
  // const height = svg.getAttribute("height");
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
  let fillRadius = radius - lineThickness / 2;

  // Makes the lines thinner when there isn't space for the full thickness
  if (radius < 20 || (radius < 35 && denominator > 10) || denominator > 15) {
    lineThickness = lineThickness / 2;
  }

  // This loop draws the circles and shades in the correct # of slices given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    if (currentX + radius >= width) {
      currentY = currentY + radius * 2 + verticalSpacing + startY;
      // Moves the remaining circles to the next line if we run out of space
      currentX = radius + horizontalSpacing / 2 + startX;
    }

    // Draws black outline of circle
    drawCircle(svg, currentX, currentY, radius, lineThickness);

    if (currentWhole <= wholeNum) {
      drawCircle(
        svg,
        currentX,
        currentY,
        fillRadius,
        lineThickness,
        "none",
        colorFill
      );
      currentWhole = currentWhole + 1;
    } else {
      shadeFractionSlices(
        svg,
        currentX,
        currentY,
        fillRadius,
        slicesLeft,
        denominator,
        lineThickness,
        colorFill,
        angleWherePiecesStart
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
}

function adjustWidthAndHeightToScale(maxWholes1, maxWholes2, width, height) {
  let adjustment = {};
  adjustment.wholeSize = Math.min(width / maxWholes1, height / maxWholes2);
  adjustment.width = adjustment.wholeSize * maxWholes1;
  adjustment.height = adjustment.wholeSize * maxWholes2;
  adjustment.centerStartX = (width - adjustment.width) / 2;
  adjustment.centerStartY = (height - adjustment.height) / 2;

  return adjustment;
}
