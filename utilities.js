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

// Helper function to convert a data URL to a blob
function dataURLtoBlob(dataURL) {
  const binary = atob(dataURL.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/png" });
}

function copyPngToClipboard(svgEl) {
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

      // Convert the PNG data to a blob
      const pngBlob = dataURLtoBlob(pngData);

      // Create a clipboard item
      const item = new ClipboardItem({ "image/png": pngBlob });

      // Write the clipboard item to the clipboard
      navigator.clipboard.write([item]).then(() => {
        console.log("PNG copied to clipboard!");
      });

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

function drawCircle(
  svg,
  x,
  y,
  radius,
  lineThickness,
  fillColor = "none",
  lineColor = "black"
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

function switchBetweenColors(current, colors) {
  const currentIndex = colors.indexOf(current);
  if (currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % colors.length;
    return colors[nextIndex];
  } else {
    return "gray";
  }
}

function findIdealNumColors(
  minGroupsPerCircle,
  maxGroupsPerCircle,
  currentNumColors
) {
  if (
    maxGroupsPerCircle % currentNumColors === 1 ||
    minGroupsPerCircle % currentNumColors === 1
  ) {
    return findIdealNumColors(
      minGroupsPerCircle,
      maxGroupsPerCircle,
      currentNumColors + 1
    );
  } else {
    console.log(`Returning ${currentNumColors}`);
    return currentNumColors;
  }
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
  borderColor = "black",
  startAngle = angleWherePiecesStart
) {
  const svgNS = svg.namespaceURI;
  const angle = (Math.PI * 2) / denominator;
  let previousAngle = startAngle;
  let currentAngle = startAngle + angle;

  for (let i = 0; i < numerator; i++) {
    const curvedPath = document.createElementNS(svgNS, "path");
    const startX = (x + radius * Math.cos(previousAngle)).toFixed(1);
    const startY = (y + radius * Math.sin(previousAngle)).toFixed(1);
    const endX = (x + radius * Math.cos(currentAngle)).toFixed(1);
    const endY = (y + radius * Math.sin(currentAngle)).toFixed(1);
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
  lineColor,
  startAngle = angleWherePiecesStart
) {
  const angle = (Math.PI * 2) / denominator;
  let currentAngle = startAngle;

  for (let i = 0; i < denominator; i++) {
    const svgNS = svg.namespaceURI;
    const line = document.createElementNS(svgNS, "line");
    const startX = (x + radius * Math.cos(currentAngle)).toFixed(1);
    const startY = (y + radius * Math.sin(currentAngle)).toFixed(1);
    const endX = x;
    const endY = y;

    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", lineColor);
    line.setAttribute("stroke-width", lineThickness);
    svg.appendChild(line);

    currentAngle += angle;
  }
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
  colorFill,
  borderColor,
  background = "transparent"
) {
  debugger;
  width = parseInt(width);
  height = parseInt(height);
  x = parseInt(x);
  y = parseInt(y);
  const svgNS = svg.namespaceURI;
  let interval = 0;
  if (denominator > 0) {
    interval = parseFloat((width / denominator).toFixed(2));
  }
  let separator = interval; // Need two variables becuase separator will increment while interval stays constant.

  let shaded = interval * numerator;
  console.log(`interval is ${interval} and numerator is ${numerator}`);

  const backgroundColor = document.createElementNS(svgNS, "rect");
  backgroundColor.setAttribute("x", x);
  backgroundColor.setAttribute("y", y);
  backgroundColor.setAttribute("width", width);
  backgroundColor.setAttribute("height", height);
  backgroundColor.setAttribute("fill", background);
  backgroundColor.setAttribute("stroke", "transparent");
  backgroundColor.setAttribute("stroke-width", 0);
  svg.appendChild(backgroundColor);

  const shadedRect = document.createElementNS(svgNS, "rect");
  shadedRect.setAttribute("x", x);
  shadedRect.setAttribute("y", y);
  shadedRect.setAttribute("width", shaded);
  shadedRect.setAttribute("height", height);
  shadedRect.setAttribute("fill", colorFill);
  shadedRect.setAttribute("stroke", borderColor);
  shadedRect.setAttribute("stroke-width", 0);
  svg.appendChild(shadedRect);

  for (let i = 1; i < denominator; i++) {
    const pieceSeparator = document.createElementNS(svgNS, "line");
    pieceSeparator.setAttribute("stroke-width", lineThickness * 0.7);
    pieceSeparator.setAttribute("stroke", borderColor);
    pieceSeparator.setAttribute("x1", x + separator);
    pieceSeparator.setAttribute("y1", y);
    pieceSeparator.setAttribute("x2", x + separator);
    pieceSeparator.setAttribute("y2", y + height);
    svg.appendChild(pieceSeparator);
    separator = separator + interval;
    debugger;
  }

  const border = document.createElementNS(svgNS, "rect");
  border.setAttribute("x", x);
  border.setAttribute("y", y);
  border.setAttribute("width", width);
  border.setAttribute("height", height);
  border.setAttribute("fill", "none");
  border.setAttribute("stroke", borderColor);
  border.setAttribute("stroke-width", lineThickness);
  svg.appendChild(border);
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
  colorFill,
  borderColor
) {
  const svgNS = svg.namespaceURI;
  let interval = 0;
  if (denominator > 0) {
    interval = parseFloat((height / denominator).toFixed(2));
  }
  let separator = interval; // Need two variables becuase separator will increment while interval stays constant.

  let shaded = interval * numerator;

  const shadedRect = document.createElementNS(svgNS, "rect");
  shadedRect.setAttribute("x", x);
  shadedRect.setAttribute("y", y);
  shadedRect.setAttribute("width", width);
  shadedRect.setAttribute("height", shaded);
  shadedRect.setAttribute("fill", colorFill);
  shadedRect.setAttribute("stroke", borderColor);
  shadedRect.setAttribute("stroke-width", 0);
  svg.appendChild(shadedRect);

  for (let i = 1; i < denominator; i++) {
    const pieceSeparator = document.createElementNS(svgNS, "line");
    pieceSeparator.setAttribute("x1", x);
    pieceSeparator.setAttribute("y1", y + separator);
    pieceSeparator.setAttribute("x2", x + width);
    pieceSeparator.setAttribute("y2", y + separator);
    pieceSeparator.setAttribute("stroke", borderColor);
    pieceSeparator.setAttribute("stroke-width", lineThickness * 0.7);
    svg.appendChild(pieceSeparator);
    separator = separator + interval;
  }

  const border = document.createElementNS(svgNS, "rect");
  border.setAttribute("x", x);
  border.setAttribute("y", y);
  border.setAttribute("width", width);
  border.setAttribute("height", height);
  border.setAttribute("fill", "none");
  border.setAttribute("stroke", borderColor);
  border.setAttribute("stroke-width", lineThickness);
  svg.appendChild(border);
}

function mixedNumCircles(
  svg,
  mixedNum,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)",
  borderColor,
  width,
  height,
  maxPerLine = 4,
  startX = 0,
  startY = 0
) {
  let numWholes = 0;
  // Figure out how long the radius of each circle should be based on the svg dimensions.
  if (mixedNum.denominator === 0) {
    numWholes = 0;
  } else {
    numWholes = Math.floor(mixedNum.numerator / mixedNum.denominator);
  }
  let maxWholes = 0; // This is how many circles will be drawn on the svg

  if (mixedNum.numerator % mixedNum.denominator == 0) {
    maxWholes = numWholes + mixedNum.wholeNum;
  } else {
    maxWholes = numWholes + mixedNum.wholeNum + 1;
  } // Determines how many total circles will be drawn even if the last one is only partially shaded

  let horizontalSpacing = 0;
  let verticalSpacing = 0;
  let circlesPerLine = maxWholes;
  let numLines = 1;

  if (maxWholes <= maxPerLine) {
    // If there are only four or less circles this puts them all on one line because it looks silly otherwise.
    numLines = 1;
    circlesPerLine = maxWholes;
    radius = Math.min((width * 0.8) / maxWholes / 2, (height * 0.8) / 2);
  } else {
    optimalDimensions = calculateOptimalDimensions(
      width * 0.8,
      height * 0.8,
      maxWholes
    ); // Multiplying by 0.8 to leave room for spacing.
    circlesPerLine = optimalDimensions.itemsPerRow;
    numLines = optimalDimensions.numRows;
    radius = optimalDimensions.size / 2;
    debugger;
  }

  horizontalSpacing = (width - circlesPerLine * radius * 2) / circlesPerLine;
  verticalSpacing = (height - numLines * radius * 2) / (numLines + 1);
  if (horizontalSpacing > verticalSpacing) {
    horizontalSpacing = verticalSpacing;
  }

  width = circlesPerLine * (radius * 2 + horizontalSpacing);
  svg.setAttribute("width", width);

  let currentX = radius + horizontalSpacing / 2;
  let currentY = radius + verticalSpacing + startY;
  let slicesLeft = mixedNum.numerator;
  let currentWhole = 1;
  let fillRadius = radius - lineThickness / 2;

  // This loop draws the circles and shades in the correct # of slices given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    if (currentX + radius >= width) {
      debugger;
      currentY = currentY + radius * 2 + verticalSpacing + startY;
      // Moves the remaining circles to the next line if we run out of space
      currentX = radius + horizontalSpacing / 2 + startX;
    }

    // Draws black outline of circle
    drawCircle(
      svg,
      currentX,
      currentY,
      radius,
      lineThickness,
      "none",
      borderColor
    );

    if (currentWhole <= mixedNum.wholeNum) {
      drawCircle(
        svg,
        currentX,
        currentY,
        fillRadius,
        lineThickness,
        colorFill,
        "none"
      );
      currentWhole = currentWhole + 1;
    } else {
      shadeFractionSlices(
        svg,
        currentX,
        currentY,
        fillRadius,
        slicesLeft,
        mixedNum.denominator,
        lineThickness,
        colorFill,
        borderColor,
        angleWherePiecesStart
      );

      makeFractionLines(
        svg,
        currentX,
        currentY,
        radius,
        mixedNum.denominator,
        lineThickness,
        borderColor
      );

      slicesLeft = slicesLeft - mixedNum.denominator;
    }
    currentX = currentX + 2 * radius + horizontalSpacing; // Move to next circle
  }
  // Returns this object of info to be used later in the fractionDivisionCircles function.
  let modelInfo = {};
  modelInfo.horizontalSpacing = horizontalSpacing;
  modelInfo.verticalSpacing = verticalSpacing;
  modelInfo.radius = radius;
  modelInfo.svg = svg;
  modelInfo.width = width;
  return modelInfo;
}

function mixedNumCirclesHorizontal(
  svg,
  mixedNum,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)",
  borderColor,
  width,
  height,
  startX = 0,
  startY = 0,
  border = false
) {
  let numWholes = Math.floor(mixedNum.numerator / mixedNum.denominator);
  let maxWholes = 0; // This is how many circles will be drawn on the svg

  if (mixedNum.numerator % mixedNum.denominator == 0) {
    maxWholes = numWholes + mixedNum.wholeNum;
  } else {
    maxWholes = numWholes + mixedNum.wholeNum + 1;
  } // Determines how many total circles will be drawn even if the last one is only partially shaded

  // let verticalSpacing = 0;

  radius = Math.min((width * 0.8) / maxWholes / 2, (height * 0.8) / 2);
  let fillRadius = radius - lineThickness / 2;

  let verticalSpacing = (height - radius * 2 + 6) / 2;
  let horizontalSpacing = Math.min(
    10,
    (width - maxWholes * radius * 2) / maxWholes
  );

  if (border === true) {
    radius = radius - 3;
    fillRadius = fillRadius - 3;
  }
  // startX =
  //   (width - maxWholes * radius * 2 - horizontalSpacing * (maxWholes + 1)) / 2;
  // width = width - startX * 2;
  startX = horizontalSpacing;
  startY = startY + verticalSpacing;
  let currentX = startX + radius + horizontalSpacing;
  let currentY = startY + radius + verticalSpacing;
  let slicesLeft = mixedNum.numerator;
  let currentWhole = 1;

  // This loop draws the circles and shades in the correct # of slices given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    // Draws black outline of circle
    drawCircle(svg, currentX, currentY, radius, lineThickness);

    if (currentWhole <= mixedNum.wholeNum) {
      drawCircle(
        svg,
        currentX,
        currentY,
        fillRadius,
        lineThickness,
        colorFill,
        "none"
      );
      currentWhole = currentWhole + 1;
    } else {
      shadeFractionSlices(
        svg,
        currentX,
        currentY,
        fillRadius,
        slicesLeft,
        mixedNum.denominator,
        lineThickness,
        colorFill,
        borderColor,
        angleWherePiecesStart
      );
      makeFractionLines(
        svg,
        currentX,
        currentY,
        radius,
        mixedNum.denominator,
        lineThickness,
        borderColor
      );

      slicesLeft = slicesLeft - mixedNum.denominator;
    }
    currentX = currentX + 2 * radius + horizontalSpacing; // Move to next circle
  }
  width = currentX - radius - horizontalSpacing;
  svg.setAttribute("width", width + 15);
  if (border === true) {
    const svgNS = svg.namespaceURI;
    const blackBorder = document.createElementNS(svgNS, "rect");
    blackBorder.setAttribute("x", startX);
    blackBorder.setAttribute("y", startY);
    blackBorder.setAttribute("width", width);
    blackBorder.setAttribute("height", height);
    blackBorder.setAttribute("fill", "none");
    blackBorder.setAttribute("stroke", borderColor);
    blackBorder.setAttribute("stroke-width", lineThickness);
    svg.appendChild(blackBorder);
  }
}

function mixedNumCirclesVertical(
  svg,
  mixedNum,
  lineThickness = 5,
  colorFill = "rgb(120, 190, 250)",
  width,
  height,
  startX = 5,
  startY = 5,
  border = false
) {
  let numWholes = Math.floor(mixedNum.numerator / mixedNum.denominator);
  let maxWholes = 0; // This is how many circles will be drawn on the svg

  if (mixedNum.numerator % mixedNum.denominator == 0) {
    maxWholes = numWholes + mixedNum.wholeNum;
  } else {
    maxWholes = numWholes + mixedNum.wholeNum + 1;
  } // Determines how many total circles will be drawn even if the last one is only partially shaded

  radius = Math.min((width * 0.8) / 2, (height * 0.8) / maxWholes / 2);

  let horizontalSpacing = (width - radius * 2) / 2;
  let verticalSpacing = (height - maxWholes * radius * 2) / (maxWholes + 1);

  let currentX = startX + radius + horizontalSpacing;
  let currentY = startY + radius + verticalSpacing;
  let slicesLeft = mixedNum.numerator;
  let currentWhole = 1;
  let fillRadius = radius - lineThickness / 2;

  if (border === true) {
    const svgNS = svg.namespaceURI;
    const blackBorder = document.createElementNS(svgNS, "rect");
    blackBorder.setAttribute("x", startX);
    blackBorder.setAttribute("y", startY);
    blackBorder.setAttribute("width", width);
    blackBorder.setAttribute("height", height);
    blackBorder.setAttribute("fill", "none");
    blackBorder.setAttribute("stroke", "black");
    blackBorder.setAttribute("stroke-width", lineThickness);
    svg.appendChild(blackBorder);
  }

  // This loop draws the circles and shades in the correct # of slices given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    // Draws black outline of circle
    drawCircle(svg, currentX, currentY, radius, lineThickness);

    if (currentWhole <= mixedNum.wholeNum) {
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
        mixedNum.denominator,
        lineThickness,
        colorFill,
        angleWherePiecesStart
      );
      makeFractionLines(
        svg,
        currentX,
        currentY,
        radius,
        mixedNum.denominator,
        lineThickness
      );

      slicesLeft = slicesLeft - mixedNum.denominator;
    }
    currentY = currentY + 2 * radius + verticalSpacing; // Move to next circle
  }
}

function adjustWidthAndHeightToScale(maxWholes1, maxWholes2, width, height) {
  let adjustment = {};
  adjustment.wholeSize = parseFloat(
    Math.min(width / maxWholes1, height / maxWholes2).toFixed(2)
  );
  adjustment.width = adjustment.wholeSize * maxWholes1;
  adjustment.height = adjustment.wholeSize * maxWholes2;
  adjustment.centerStartX = (width - adjustment.width) / 2;
  adjustment.centerStartY = (height - adjustment.height) / 2;

  return adjustment;
}
