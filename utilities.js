function downloadPng(svgEl) {
  if (svgEl instanceof Node) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgXml = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgXml], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get the canvas data as a PNG-encoded string
      const pngData = canvas.toDataURL('image/png');

      // Create a link to download the PNG file
      const a = document.createElement('a');
      a.href = pngData;
      a.download = 'my-image.png';
      a.click();

      URL.revokeObjectURL(url);
    };
    img.src = url;
    img.onerror = function () {
      console.error('Failed to load image');
    };
  } else {
    console.error('The object is not a node');
  }
}

function downloadSvg(svgEl) {
  if (svgEl instanceof Node) {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([xmlString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error('The object is not a node.');
  }
}

// Helper function to convert a data URL to a blob
function dataURLtoBlob(dataURL) {
  const binary = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' });
}

function copyPngToClipboard(svgEl) {
  if (svgEl instanceof Node) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgXml = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgXml], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get the canvas data as a PNG-encoded string
      const pngData = canvas.toDataURL('image/png');

      // Convert the PNG data to a blob
      const pngBlob = dataURLtoBlob(pngData);

      // Create a clipboard item
      const item = new ClipboardItem({ 'image/png': pngBlob });

      // Write the clipboard item to the clipboard
      navigator.clipboard.write([item]).then(() => {});

      URL.revokeObjectURL(url);
    };
    img.src = url;
    img.onerror = function () {
      console.error('Failed to load image');
    };
  } else {
    console.error('The object is not a node');
  }
}

function drawCircle(
  svg,
  x,
  y,
  radius,
  lineThickness,
  fillColor = 'none',
  lineColor = 'black'
) {
  const svgNS = svg.namespaceURI;
  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', radius);
  circle.setAttribute('stroke', lineColor);
  circle.setAttribute('fill', fillColor);
  circle.setAttribute('stroke-width', lineThickness);
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
    return 'gray';
  }
}

function findIdealNumColors(numerator, denominator, currentNumColors) {
  /** 
This function uses recursion to find the ideal number of colors to show fraction division with circles and avoid two separate groups of the same color bordering each other (imagine 3 groups of 2/6ths in a circle and only 2 alternating colors. You would have 4/6ths all adjacent to each other in the same color which would be confusing and misleading. So the idealNumColors for any problem with a divisor of 2/6ths would be 3. But with divisors such as 4/7ths for example, not every circle will have the same number of groups. One circle may have 4/7ths and 3/7ths (minGroupsPerCircle = 2) but the next circle would then have 1/7th, 4/7ths, and 2/7ths (maxGroupsPerCircle = 3). This means the remainders of minGroupsPerCircle/numColors and maxGroupsPerCircle / numColors should not be 1.

Take 5/9ths as an example.The minGroupsPerCircle is 2 (5/9ths and 4/9ths for example) and the maxGroupsPerCircle is 3 (1/9th, 5/9ths, and 3/9ths for example). First the function will try numColors = 2. For the circles with 3 different groups, there would be two adjacent groups with the same color which is a problem. The check for maxGroupsPerCircle % numColors === 1 will be true (indicating that numColors cannot be 2). Then the function calls itself to run again, this time trying numColors = 3. 3 alternating colors will work for both circles with two groups and three groups. So this function would return the idealNumColors as 3.
The algorithm will sometimes choose more colors than needed but I prefer it that way.
*/
  if (denominator % numerator === 0) {
    minGroupsPerCircle = denominator / numerator;
    maxGroupsPerCircle = minGroupsPerCircle;
  } else if ((denominator * 2) % numerator === 0) {
    minGroupsPerCircle = Math.ceil(denominator / numerator);
    maxGroupsPerCircle = minGroupsPerCircle;
  } else {
    minGroupsPerCircle = Math.ceil(denominator / numerator);
    maxGroupsPerCircle = minGroupsPerCircle + 1;
  }
  if (
    minGroupsPerCircle % currentNumColors === 1 ||
    maxGroupsPerCircle % currentNumColors === 1
  ) {
    return findIdealNumColors(numerator, denominator, currentNumColors + 1);
  } else {
  }
  return currentNumColors;
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
  borderColor = 'black',
  startAngle = angleWherePiecesStart
) {
  const svgNS = svg.namespaceURI;
  const angle = (Math.PI * 2) / denominator;
  let previousAngle = startAngle;
  let currentAngle = startAngle + angle;

  for (let i = 0; i < numerator; i++) {
    const curvedPath = document.createElementNS(svgNS, 'path');
    const startX = (x + radius * Math.cos(previousAngle)).toFixed(1);
    const startY = (y + radius * Math.sin(previousAngle)).toFixed(1);
    const endX = (x + radius * Math.cos(currentAngle)).toFixed(1);
    const endY = (y + radius * Math.sin(currentAngle)).toFixed(1);
    curvedPath.setAttribute('fill', colorFill);
    curvedPath.setAttribute(
      'd',
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
  if (denominator > 1) {
    for (let i = 0; i < denominator; i++) {
      const svgNS = svg.namespaceURI;
      const line = document.createElementNS(svgNS, 'line');
      const startX = (x + radius * Math.cos(currentAngle)).toFixed(1);
      const startY = (y + radius * Math.sin(currentAngle)).toFixed(1);
      const endX = x;
      const endY = y;

      line.setAttribute('x1', startX);
      line.setAttribute('y1', startY);
      line.setAttribute('x2', endX);
      line.setAttribute('y2', endY);
      line.setAttribute('stroke', lineColor);
      line.setAttribute('stroke-width', lineThickness);
      svg.appendChild(line);

      currentAngle += angle;
    }
  }
}

//69 lines
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
  background = 'none',
  opacity = 1
) {
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

  const backgroundColor = document.createElementNS(svgNS, 'rect');
  backgroundColor.setAttribute('x', x);
  backgroundColor.setAttribute('y', y);
  backgroundColor.setAttribute('width', width);
  backgroundColor.setAttribute('height', height);
  backgroundColor.setAttribute('fill', background);
  backgroundColor.setAttribute('stroke', 'none');
  backgroundColor.setAttribute('stroke-width', 0);
  svg.appendChild(backgroundColor);

  const shadedRect = document.createElementNS(svgNS, 'rect');
  shadedRect.setAttribute('x', x);
  shadedRect.setAttribute('y', y);
  shadedRect.setAttribute('width', shaded);
  shadedRect.setAttribute('height', height);
  shadedRect.setAttribute('fill', colorFill);
  shadedRect.setAttribute('opacity', opacity);
  shadedRect.setAttribute('stroke', borderColor);
  shadedRect.setAttribute('stroke-width', 0);
  svg.appendChild(shadedRect);

  for (let i = 1; i < denominator; i++) {
    const pieceSeparator = document.createElementNS(svgNS, 'line');
    pieceSeparator.setAttribute('stroke-width', lineThickness * 0.7);
    pieceSeparator.setAttribute('stroke', borderColor);
    pieceSeparator.setAttribute('x1', x + separator);
    pieceSeparator.setAttribute('y1', y);
    pieceSeparator.setAttribute('x2', x + separator);
    pieceSeparator.setAttribute('y2', y + height);
    svg.appendChild(pieceSeparator);
    separator = separator + interval;
  }

  const border = document.createElementNS(svgNS, 'rect');
  border.setAttribute('x', x);
  border.setAttribute('y', y);
  border.setAttribute('width', width);
  border.setAttribute('height', height);
  border.setAttribute('fill', 'none');
  border.setAttribute('stroke', borderColor);
  border.setAttribute('stroke-width', lineThickness);
  svg.appendChild(border);
}
// 54 lines
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
  borderColor,
  opacity = 1
) {
  const svgNS = svg.namespaceURI;
  let interval = 0;
  if (denominator > 0) {
    interval = parseFloat((height / denominator).toFixed(2));
  }
  let separator = interval; // Need two variables becuase separator will increment while interval stays constant.

  let shaded = interval * numerator;

  const shadedRect = document.createElementNS(svgNS, 'rect');
  shadedRect.setAttribute('x', x);
  shadedRect.setAttribute('y', y);
  shadedRect.setAttribute('width', width);
  shadedRect.setAttribute('height', shaded);
  shadedRect.setAttribute('fill', colorFill);
  shadedRect.setAttribute('opacity', opacity);
  shadedRect.setAttribute('stroke', borderColor);
  shadedRect.setAttribute('stroke-width', 0);
  svg.appendChild(shadedRect);

  for (let i = 1; i < denominator; i++) {
    const pieceSeparator = document.createElementNS(svgNS, 'line');
    pieceSeparator.setAttribute('x1', x);
    pieceSeparator.setAttribute('y1', y + separator);
    pieceSeparator.setAttribute('x2', x + width);
    pieceSeparator.setAttribute('y2', y + separator);
    pieceSeparator.setAttribute('stroke', borderColor);
    pieceSeparator.setAttribute('stroke-width', lineThickness * 0.7);
    svg.appendChild(pieceSeparator);
    separator = separator + interval;
  }

  const border = document.createElementNS(svgNS, 'rect');
  border.setAttribute('x', x);
  border.setAttribute('y', y);
  border.setAttribute('width', width);
  border.setAttribute('height', height);
  border.setAttribute('fill', 'none');
  border.setAttribute('stroke', borderColor);
  border.setAttribute('stroke-width', lineThickness);
  svg.appendChild(border);
}
//120 lines
function mixedNumBars(
  svg,
  wholeNum,
  numerator,
  denominator,
  lineThickness,
  colorFill,
  borderColor
) {
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');
  const svgNS = svg.namespaceURI;
  let numWholes = 0;
  let maxWholes = 0; // This is how many bars will be drawn on the svg

  if (numerator && denominator) {
    numWholes = Math.floor(numerator / denominator);
  } else if (numerator === 0 && denominator > 0) {
    numWholes = 1;
  }

  if (numerator % denominator > 0) {
    maxWholes = numWholes + wholeNum + 1;
  } else {
    maxWholes = numWholes + wholeNum;
  } // Determines how many total bars will be drawn even if the last one is only partially shaded

  let horizontalSpacing = 0;
  let verticalSpacing = 0;
  let barsPerLine = maxWholes;
  let numLines = 1;
  let barHeight = height;

  if (maxWholes <= 7) {
    // If there are only 7 or less bars this puts them all on one line because it looks silly otherwise.
    numLines = 1;
    barsPerLine = maxWholes;
    barWidth = parseFloat(((width * 0.9) / maxWholes).toFixed(2));
    barHeight = height * 0.8;
  } else {
    optimalDimensions = calculateOptimalDimensions(
      width * 0.9,
      height * 0.8,
      maxWholes
    ); // Multiplying by 0.8 and 0.9 to leave room for spacing.
    barsPerLine = optimalDimensions.itemsPerRow;
    numLines = optimalDimensions.numRows;
    barWidth = optimalDimensions.size;
    barHeight = optimalDimensions.size;
  }

  horizontalSpacing = parseFloat(
    ((width - barsPerLine * barWidth) / barsPerLine).toFixed(2)
  );

  verticalSpacing = parseFloat(
    ((height - numLines * barHeight) / (numLines + 1)).toFixed(2)
  );

  let currentX = horizontalSpacing / 2;
  let currentY = verticalSpacing;
  let currentWhole = 1;
  let piecesLeft = numerator;

  // Draws the bars and shades in the correct # of pieces given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    if (currentX + barWidth >= width) {
      currentY = currentY + barHeight + verticalSpacing; // Moves the remaining bars to the next line if we run out of space
      currentX = horizontalSpacing / 2;
    }
    const wholeBar = document.createElementNS(svgNS, 'rect');

    if (currentWhole <= wholeNum) {
      wholeBar.setAttribute('x', currentX);
      wholeBar.setAttribute('y', currentY);
      wholeBar.setAttribute('width', barWidth);
      wholeBar.setAttribute('height', barHeight);
      wholeBar.setAttribute('stroke', borderColor);
      wholeBar.setAttribute('stroke-width', lineThickness);
      wholeBar.setAttribute('fill', colorFill);
      svg.appendChild(wholeBar);
      currentWhole = currentWhole + 1;
    } else {
      if (piecesLeft > denominator) {
        numerator = denominator;
        piecesLeft = piecesLeft - denominator;
      } else {
        numerator = piecesLeft;
      }
      if (barWidth > barHeight) {
        drawVerticalFractionBar(
          svg,
          currentX,
          currentY,
          barWidth,
          barHeight,
          numerator,
          denominator,
          lineThickness,
          colorFill,
          borderColor,
          'transparent'
        );
      } else {
        drawHorizontalFractionBar(
          svg,
          currentX,
          currentY,
          barWidth,
          barHeight,
          numerator,
          denominator,
          lineThickness,
          colorFill,
          borderColor
        );
      }
    }
    currentX = currentX + barWidth + horizontalSpacing; // Move to next bar
  }
}
//94 lines
function mixedNumCircles(
  svg,
  mixedNum,
  lineThickness = 5,
  fillColor = 'rgb(120, 190, 250)',
  borderColor,
  width,
  height,
  maxPerLine = 4,
  startX = 0,
  startY = 0
) {
  let numWholes = 0;
  let maxWholes = 0; // This is how many circles will be drawn on the svg
  console.log('Beginning of mixedNumCircles', mixedNum.wholeNum);
  if (mixedNum.denominator === 0) {
    numWholes = 0;
  } else if (mixedNum.numerator === 0 && mixedNum.denominator > 0) {
    numWholes = 1;
  } else {
    numWholes = Math.floor(mixedNum.numerator / mixedNum.denominator);
  }
  console.log(numWholes);

  if (mixedNum.denominator === 0) {
    maxWholes = mixedNum.wholeNum;
  } else if (mixedNum.denominator === 1 && mixedNum.numerator > 0) {
    maxWholes = mixedNum.wholeNum + mixedNum.numerator;
    mixedNum.wholeNum += mixedNum.numerator;
  } else if (mixedNum.numerator % mixedNum.denominator == 0) {
    maxWholes = numWholes + mixedNum.wholeNum;
  } else {
    maxWholes = numWholes + mixedNum.wholeNum + 1;
  } // Determines how many total circles will be drawn even if the last one is only partially shaded

  console.log(maxWholes);
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
  }

  horizontalSpacing = (width - circlesPerLine * radius * 2) / circlesPerLine;
  verticalSpacing = (height - numLines * radius * 2) / (numLines + 1);
  if (horizontalSpacing > verticalSpacing) {
    horizontalSpacing = verticalSpacing;
  }

  width = circlesPerLine * (radius * 2 + horizontalSpacing);
  svg.setAttribute('width', width);

  let currentX = radius + horizontalSpacing / 2;
  let currentY = radius + verticalSpacing + startY;
  let slicesToFill = mixedNum.numerator;

  // This loop draws the circles and shades in the correct # of slices given an improper fraction
  drawMixedNumCircles(
    svg,
    slicesToFill,
    mixedNum.denominator,
    mixedNum.wholeNum,
    maxWholes,
    startX,
    startY,
    currentX,
    currentY,
    width,
    radius,
    lineThickness,
    fillColor,
    borderColor,
    horizontalSpacing,
    verticalSpacing
  );
  // Returns this object of info to be used later in the fractionDivisionCircles function.
  let modelInfo = {};
  modelInfo.horizontalSpacing = horizontalSpacing;
  modelInfo.verticalSpacing = verticalSpacing;
  modelInfo.radius = radius;
  modelInfo.svg = svg;
  modelInfo.width = width;
  return modelInfo;
}
//77 lines
function drawMixedNumCircles(
  svg,
  slicesToFill,
  denominator,
  wholeNum,
  maxWholes,
  startX,
  startY,
  currentX,
  currentY,
  width,
  radius,
  lineThickness,
  fillColor,
  borderColor,
  horizontalSpacing,
  verticalSpacing
) {
  let currentWhole = 1;
  let fillRadius = radius - lineThickness / 2;

  for (let i = 0; i < maxWholes; i++) {
    if (currentX + radius >= width) {
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
      'none',
      borderColor
    );

    if (currentWhole <= wholeNum) {
      drawCircle(
        svg,
        currentX,
        currentY,
        fillRadius,
        lineThickness,
        fillColor,
        'none'
      );
      currentWhole = currentWhole + 1;
    } else {
      shadeFractionSlices(
        svg,
        currentX,
        currentY,
        fillRadius,
        slicesToFill,
        denominator,
        lineThickness,
        fillColor,
        borderColor,
        angleWherePiecesStart
      );

      makeFractionLines(
        svg,
        currentX,
        currentY,
        radius,
        denominator,
        lineThickness,
        borderColor
      );

      slicesToFill = slicesToFill - denominator;
    }
    currentX = currentX + 2 * radius + horizontalSpacing; // Move to next circle
  }
}
//103 lines
function mixedNumCirclesHorizontal(
  svg,
  mixedNum,
  lineThickness,
  colorFill = 'rgb(120, 190, 250)',
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
        'none'
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
  svg.setAttribute('width', width + 15);
  if (border === true) {
    const svgNS = svg.namespaceURI;
    const blackBorder = document.createElementNS(svgNS, 'rect');
    blackBorder.setAttribute('x', startX);
    blackBorder.setAttribute('y', startY);
    blackBorder.setAttribute('width', width);
    blackBorder.setAttribute('height', height);
    blackBorder.setAttribute('fill', 'none');
    blackBorder.setAttribute('stroke', borderColor);
    blackBorder.setAttribute('stroke-width', lineThickness);
    svg.appendChild(blackBorder);
  }
}
//97 lines
function mixedNumCirclesVertical(
  svg,
  mixedNum,
  lineThickness,
  colorFill = 'rgb(120, 190, 250)',
  borderColor,
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
    const blackBorder = document.createElementNS(svgNS, 'rect');
    blackBorder.setAttribute('x', startX);
    blackBorder.setAttribute('y', startY);
    blackBorder.setAttribute('width', width);
    blackBorder.setAttribute('height', height);
    blackBorder.setAttribute('fill', 'none');
    blackBorder.setAttribute('stroke', borderColor);
    blackBorder.setAttribute('stroke-width', lineThickness);
    svg.appendChild(blackBorder);
  }

  // This loop draws the circles and shades in the correct # of slices given an improper fraction
  for (let i = 0; i < maxWholes; i++) {
    // Draws black outline of circle (for wholes and fractions)
    drawCircle(
      svg,
      currentX,
      currentY,
      radius,
      lineThickness,
      'none',
      borderColor
    );

    if (currentWhole <= mixedNum.wholeNum) {
      // Fully shades in circle if it's a whole
      drawCircle(
        svg,
        currentX,
        currentY,
        fillRadius,
        0,
        colorFill,
        borderColor
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
