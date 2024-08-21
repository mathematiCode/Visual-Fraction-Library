mathVisual.fractionBar = (
  svg,
  mixedNum,
  lineThickness = 5,
  colorFill = "#52a4b0"
) => {
  const width = svg.getAttribute("width") - lineThickness - 5;
  const height = svg.getAttribute("height") - lineThickness - 5;
  const svgNS = svg.namespaceURI;

  if (mixedNum.numerator > mixedNum.denominator) {
    return alert(
      `Please enter a proper fraction in the fraction area. Use the whole number to display a mixed number.`
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
      colorFill
    );
  } else if (mixedNum.wholeNum > 0) {
    mathVisual.mixedNumBars(
      svg,
      mixedNum.wholeNum,
      mixedNum.numerator,
      mixedNum.denominator,
      lineThickness,
      colorFill
    );
  } else {
    drawVerticalFractionBar(
      svg,
      lineThickness,
      lineThickness,
      width,
      height,
      mixedNum.numerator,
      mixedNum.denominator,
      lineThickness,
      colorFill
    );
  }
};

mathVisual.fractionCircle = (
  svg,
  mixedNum,
  lineThickness = 5,
  colorFill = "#52a4b0"
) => {
  let width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  if (
    mixedNum.numerator < 0 ||
    mixedNum.denominator <= 0 ||
    mixedNum.wholeNum < 0
  ) {
    return alert(`Please enter a positive number.`);
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
    mixedNumCircles(svg, mixedNum, lineThickness, colorFill, width, height);
    return;
  } else if (
    mixedNum.numerator > mixedNum.denominator ||
    mixedNum.wholeNum > 0
  ) {
    mixedNumCircles(svg, mixedNum, lineThickness, colorFill, width, height);

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

  drawCircle(svg, x, y, radius - 5, lineThickness); // Draws the outer circle

  shadeFractionSlices(
    svg,
    x,
    y,
    radius - lineThickness / 2 - 5,
    mixedNum.numerator,
    mixedNum.denominator,
    lineThickness,
    colorFill,
    angleWherePiecesStart
  ); // Shades in the fraction portion and draws lines to show each slice
  makeFractionLines(svg, x, y, radius - 5, mixedNum.denominator);
  svg.setAttribute("width", width);
};

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
  let barsPerLine = maxWholes;
  let numLines = 1;
  let barHeight = height;

  if (maxWholes <= 7) {
    // If there are only four or less bars this puts them all on one line because it looks silly otherwise.
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
      wholeBar.setAttribute("stroke", "black");
      wholeBar.setAttribute("stroke-width", lineThickness);
      wholeBar.setAttribute("fill", colorFill);
      svg.appendChild(wholeBar);
      currentWhole = currentWhole + 1;
    } else {
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
          colorFill
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
          colorFill
        );
      }
    }
    currentX = currentX + barWidth + horizontalSpacing; // Move to next bar
  }
};
