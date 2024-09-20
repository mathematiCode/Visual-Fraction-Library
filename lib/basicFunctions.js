mathVisual.fractionBar = (
  svg,
  mixedNum,
  lineThickness,
  colorFill,
  borderColor
) => {
  let width = svg.getAttribute("width") - lineThickness * 2;
  const height = svg.getAttribute("height") - lineThickness * 2;

  for (const key in mixedNum) {
    if (!mixedNum[key]) {
      mixedNum[key] = 0;
    }
  }

  if (
    mixedNum.wholeNum === 0 &&
    mixedNum.numerator === 0 &&
    mixedNum.denominator === 0
  ) {
    return;
  } else if (
    mixedNum.wholeNum < 0 ||
    mixedNum.numerator < 0 ||
    mixedNum.denominator < 0
  ) {
    return alert(
      `Please enter a positive number in each box or leave it blank.`
    );
  } else if (mixedNum.wholeNum > 250) {
    return alert(
      `This many items does not display nicely. Try a whole number less than 250.`
    );
  } else if (mixedNum.wholeNum > 160) {
    mathVisual.mixedNumBars(
      svg,
      mixedNum.wholeNum,
      mixedNum.numerator,
      mixedNum.denominator,
      lineThickness / 2,
      colorFill,
      borderColor
    );
  } else if (
    mixedNum.wholeNum > 0 ||
    mixedNum.numerator > mixedNum.denominator
  ) {
    mathVisual.mixedNumBars(
      svg,
      mixedNum.wholeNum,
      mixedNum.numerator,
      mixedNum.denominator,
      lineThickness,
      colorFill,
      borderColor
    );
  } else {
    drawVerticalFractionBar(
      svg,
      lineThickness, // for startX
      lineThickness, // for startY
      width,
      height,
      mixedNum.numerator,
      mixedNum.denominator,
      lineThickness,
      colorFill,
      borderColor,
      "transparent"
    );
    debugger;
  }
};

mathVisual.fractionCircle = (
  svg,
  mixedNum,
  lineThickness = 5,
  colorFill = "#52a4b0",
  borderColor = "black"
) => {
  let width = svg.getAttribute("width");
  const height = svg.getAttribute("height");

  for (const key in mixedNum) {
    if (!mixedNum[key]) {
      mixedNum[key] = 0;
    }
  }
  if (
    mixedNum.wholeNum === 0 &&
    mixedNum.numerator === 0 &&
    mixedNum.denominator === 0
  ) {
    return;
  } else if (
    mixedNum.numerator < 0 ||
    mixedNum.denominator < 0 ||
    mixedNum.wholeNum < 0
  ) {
    return alert(`Please enter a positive number.`);
  } else if (mixedNum.denominator === 0 && mixedNum.numerator > 0) {
    return alert(`Please enter a fraction or leave the fraction blank.`);
  } else if (
    mixedNum.wholeNum > 350 ||
    mixedNum.numerator > 350 ||
    mixedNum.denominator > 350
  ) {
    return alert(
      `This many items or pieces will not display well. Please try numbers less than 350.`
    );
  } else if (mixedNum.wholeNum > 125) {
    lineThickness = lineThickness / 2;
    return;
  } else if (mixedNum.wholeNum * mixedNum.denominator > 900) {
    lineThickness = lineThickness / 4;
  } else if (mixedNum.wholeNum * mixedNum.denominator > 350) {
    lineThickness = lineThickness / 2;
  }
  if (mixedNum.numerator > mixedNum.denominator || mixedNum.wholeNum > 0) {
    mixedNumCircles(
      svg,
      mixedNum,
      lineThickness,
      colorFill,
      borderColor,
      width,
      height
    );
    return;
  }
  let radius = 0;
  if (width <= height) {
    radius = width / 2;
  } else {
    radius = height / 2;
  }
  width = 2 * radius + 10;
  // Set the circle properties
  const x = width / 2; // x-coordinate of the center
  const y = height / 2; // y-coordinate of the center

  if (mixedNum.numerator === mixedNum.denominator) {
    drawCircle(
      svg,
      x,
      y,
      radius - lineThickness,
      lineThickness,
      colorFill,
      borderColor
    );
  } else {
    drawCircle(
      svg,
      x,
      y,
      radius - lineThickness,
      lineThickness,
      "transparent",
      borderColor
    ); // Draws the outer circle
  }
  shadeFractionSlices(
    svg,
    x,
    y,
    radius - lineThickness / 2 - lineThickness,
    mixedNum.numerator,
    mixedNum.denominator,
    lineThickness,
    colorFill,
    borderColor,
    angleWherePiecesStart
  ); // Shades in the fraction portion and draws lines to show each slice
  makeFractionLines(
    svg,
    x,
    y,
    radius - lineThickness,
    mixedNum.denominator,
    lineThickness,
    borderColor
  );

  svg.setAttribute("width", width);
};

mathVisual.mixedNumBars = (
  svg,
  wholeNum,
  numerator,
  denominator,
  lineThickness,
  colorFill,
  borderColor
) => {
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
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
    const wholeBar = document.createElementNS(svgNS, "rect");

    if (currentWhole <= wholeNum) {
      wholeBar.setAttribute("x", currentX);
      wholeBar.setAttribute("y", currentY);
      wholeBar.setAttribute("width", barWidth);
      wholeBar.setAttribute("height", barHeight);
      wholeBar.setAttribute("stroke", borderColor);
      wholeBar.setAttribute("stroke-width", lineThickness);
      wholeBar.setAttribute("fill", colorFill);
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
          "transparent"
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
};
