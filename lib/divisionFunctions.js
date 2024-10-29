mathVisual.fractionDivisionBar = (svg, dividend, divisor, attributes) => {
  for (const key in dividend) {
    if (!dividend[key]) {
      dividend[key] = 0;
    }
  }
  for (const key in divisor) {
    if (!divisor[key]) {
      divisor[key] = 0;
    }
  }
  const spaceForLabels = 10;
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height") - spaceForLabels;
  const svgNS = svg.namespaceURI;
  let numSections = 0;

  let actualLineThickness = attributes.lineThickness;

  // Need to add error handling for decimal, blank or negative inputs
  if (!dividend.wholeNum) {
    dividend.wholeNum = 0;
  } // If the wholeNum input is blank, the variable is set to 0.
  if (!dividend.numerator) {
    dividend.numerator = 0;
    console.log("Numerator is set to 0.");
  }

  if (
    dividend.wholeNum < 0 ||
    dividend.numerator < 0 ||
    dividend.denominator < 0 ||
    divisor.numerator < 0 ||
    divisor.denominator < 0
  ) {
    return alert(
      `Please enter a positive number in each box or leave it blank.`
    );
  } else if (
    (dividend.wholeNum === NaN &&
      dividend.numerator === NaN &&
      dividend.denominator === NaN) ||
    (divisor.wholeNum === NaN &&
      divisor.numerator === NaN &&
      divisor.denominator === NaN) ||
    (dividend.wholeNum === NaN && dividend.numerator === NaN) ||
    divisor.numerator === NaN ||
    (dividend.wholeNum === NaN && dividend.denominator === NaN) ||
    divisor.denominator === NaN
  ) {
    return;
  } else if (
    (dividend.wholeNum === 0 &&
      dividend.numerator === 0 &&
      dividend.denominator === 0) ||
    (divisor.numerator === 0 && divisor.denominator === 0)
  ) {
    return;
  } else if (dividend.wholeNum == 0 && dividend.numerator == 0) {
    return alert(`Please enter a positive dividend.`);
  } else if (dividend.denominator == 0 || divisor.denominator == 0) {
    return alert(`All denominators must be positive.`);
  } else if (dividend.wholeNum * divisor.denominator > 100) {
    return alert(
      `These pieces will be too small to display nicely on a bar. Please try a smaller whole number or a smaller denominator. Or use the circle model instead.`
    );
  } else if (dividend.wholeNum == 0) {
    numSections = dividend.denominator;
  } else if (dividend.numerator == 0) {
    numSections = dividend.wholeNum;
  } else {
    numSections = dividend.wholeNum + 1;
  }

  if (dividend.wholeNum * divisor.denominator > 50) {
    actualLineThickness = actualLineThickness / 2;
  }

  const interval = parseFloat((width / numSections).toFixed(2));
  let separator = interval;
  dividend.size = 0;

  if (!dividend.numerator) {
    dividend.numerator = 0;
  }

  if (dividend.wholeNum == 0) {
    dividend.size = interval * dividend.numerator;
  } else {
    dividend.size = parseFloat(
      (
        interval * dividend.wholeNum +
        (interval / dividend.denominator) * dividend.numerator
      ).toFixed(2) -
        actualLineThickness * 2
    );
  } // dividend.size unit: pixels

  let segmenter; // This represents how big the divisor is in pixels relative to the dividend
  if (dividend.wholeNum == 0) {
    segmenter = parseFloat(
      ((width / divisor.denominator) * divisor.numerator).toFixed(2)
    );
  } else {
    segmenter = parseFloat(
      ((interval / divisor.denominator) * divisor.numerator).toFixed(2)
    );
  }

  dividend.improperNumerator =
    dividend.wholeNum * dividend.denominator + dividend.numerator;

  let slicesToBeFilled = Math.ceil(
    (dividend.improperNumerator * divisor.denominator) / dividend.denominator
  );

  let numSegments = Math.ceil(slicesToBeFilled / divisor.numerator);
  let sizeOfLastPiece = parseFloat(
    (
      ((dividend.wholeNum + dividend.numerator / dividend.denominator) %
        (divisor.numerator / divisor.denominator)) *
      interval
    ).toFixed(2)
  );
  if (sizeOfLastPiece === 0) {
    sizeOfLastPiece = segmenter;
  }

  //color each section alternating colors
  for (let i = 1; i <= numSegments; i++) {
    const section = document.createElementNS(svgNS, "rect");
    if (i % 2 == 0) {
      section.setAttribute("fill", attributes.colorArray[1]);
    } else {
      section.setAttribute("fill", attributes.colorArray[0]);
    }

    // Colors the last segment partially if it's not a whole group
    if (i == numSegments) {
      section.setAttribute("x", segmenter * i - segmenter);
      section.setAttribute("y", actualLineThickness * 2);
      section.setAttribute("width", sizeOfLastPiece);
      section.setAttribute("height", height - actualLineThickness * 2);
      svg.appendChild(section);
      debugger;
    } else {
      section.setAttribute("x", segmenter * i - segmenter);
      section.setAttribute("y", 0);
      section.setAttribute("width", segmenter);
      section.setAttribute("height", height);
      svg.appendChild(section);
    }

    // Create dashed lines to segment each iteration of the divisor
    const firstDottedLine = document.createElementNS(svgNS, "line");
    firstDottedLine.setAttribute("x1", segmenter * (i - 1));
    firstDottedLine.setAttribute("y1", actualLineThickness * 3);
    firstDottedLine.setAttribute("x2", segmenter * (i - 1));
    firstDottedLine.setAttribute("y2", height);
    firstDottedLine.setAttribute("stroke", attributes.lineColor);
    firstDottedLine.setAttribute("stroke-width", actualLineThickness);
    firstDottedLine.setAttribute("stroke-dasharray", "5, 5");
    svg.appendChild(firstDottedLine);
    // Dashed border which is invisible if the dividend is a whole number but shows the next integer up if the dividend is a mixed number
    const dottedRect = document.createElementNS(svgNS, "rect");
    dottedRect.setAttribute("x", actualLineThickness);
    dottedRect.setAttribute("y", actualLineThickness);
    dottedRect.setAttribute("width", width - actualLineThickness * 3);
    dottedRect.setAttribute("height", height);
    dottedRect.setAttribute("fill", "none");
    dottedRect.setAttribute("stroke", attributes.lineColor);
    dottedRect.setAttribute("stroke-width", actualLineThickness * 1.5);
    dottedRect.setAttribute("stroke-dasharray", "5, 5");
    svg.appendChild(dottedRect);

    // Create dashed lines to segment each iteration of the divisor
    const dottedLine = document.createElementNS(svgNS, "line");
    dottedLine.setAttribute("x1", segmenter * i);
    dottedLine.setAttribute("y1", actualLineThickness * 3);
    dottedLine.setAttribute("x2", segmenter * i);
    dottedLine.setAttribute("y2", height - actualLineThickness);
    dottedLine.setAttribute("stroke", attributes.lineColor);
    dottedLine.setAttribute("stroke-width", actualLineThickness);
    dottedLine.setAttribute("stroke-dasharray", "5, 5");
    svg.appendChild(dottedLine);
  }

  // Create solid separators for each whole OR if the dividend is less than one, for each portion
  for (let i = 1; i < numSections; i++) {
    const boldLine = document.createElementNS(svgNS, "line");
    boldLine.setAttribute("stroke-dasharray", "none");
    boldLine.setAttribute("stroke", attributes.lineColor);
    boldLine.setAttribute("x1", separator);
    boldLine.setAttribute("y1", 0);
    boldLine.setAttribute("x2", separator);
    boldLine.setAttribute("y2", height);
    boldLine.setAttribute("stroke-width", actualLineThickness * 3);

    separator = separator + interval;
    svg.appendChild(boldLine);
  }

  // thin unit fraction lines
  let unitFractionWidth;
  if (dividend.wholeNum == 0) {
    unitFractionWidth = width / divisor.denominator;
  } else {
    unitFractionWidth = parseFloat(
      (width / (numSections * divisor.denominator)).toFixed(2)
    );
  }
  let unitFracDivider = unitFractionWidth;

  for (let i = 1; i < numSections * divisor.denominator; i++) {
    const thinLine = document.createElementNS(svgNS, "line");
    thinLine.setAttribute("stroke-width", actualLineThickness / 2);
    thinLine.setAttribute("stroke", attributes.lineColor);
    thinLine.setAttribute("x1", unitFracDivider);
    thinLine.setAttribute("y1", actualLineThickness);
    thinLine.setAttribute("x2", unitFracDivider);
    thinLine.setAttribute("y2", height);
    svg.appendChild(thinLine);
    unitFracDivider = unitFracDivider + unitFractionWidth;
  }

  // Create solid black outline
  const blackOutline = document.createElementNS(svgNS, "rect");
  blackOutline.setAttribute("stroke-width", actualLineThickness * 3);
  blackOutline.setAttribute("fill", "none");
  blackOutline.setAttribute("stroke", attributes.lineColor);
  blackOutline.setAttribute("x", actualLineThickness);
  blackOutline.setAttribute("y", actualLineThickness);
  blackOutline.setAttribute("width", dividend.size);
  blackOutline.setAttribute("height", height);
  svg.appendChild(blackOutline);
};

mathVisual.fractionDivisionCircles = (svg, dividend, divisor, attributes) => {
  for (const key in dividend) {
    if (!dividend[key]) {
      dividend[key] = 0;
    }
  }
  for (const key in divisor) {
    if (!divisor[key]) {
      divisor[key] = 0;
    }
  }
  // mixedNumCircles will draw the dividend.
  let width = svg.getAttribute("width");
  const height = svg.getAttribute("height");

  let actualLineThickness = attributes.lineThickness;

  if (!dividend.wholeNum) {
    dividend.wholeNum = 0;
  } // If the wholeNum input is blank, the variable is set to 0.
  else if (
    (dividend.wholeNum === NaN &&
      dividend.numerator === NaN &&
      dividend.denominator === NaN) ||
    (divisor.wholeNum === NaN &&
      divisor.numerator === NaN &&
      divisor.denominator === NaN) ||
    (dividend.wholeNum === NaN && dividend.numerator === NaN) ||
    divisor.numerator === NaN ||
    (dividend.wholeNum === NaN && dividend.denominator === NaN) ||
    divisor.denominator === NaN
  ) {
    return;
  } else if (
    dividend.wholeNum < 0 ||
    dividend.numerator < 0 ||
    dividend.denominator < 0 ||
    divisor.numerator < 0 ||
    divisor.denominator < 0
  ) {
    return alert(
      `Please enter a positive number in each box or leave it blank.`
    );
  } else if (dividend.wholeNum == 0 && dividend.numerator == 0) {
    return alert(`Please enter a positive dividend.`);
  } else if (dividend.denominator == 0 || divisor.denominator == 0) {
    return alert(`All denominators must be positive.`);
  } else if (dividend.wholeNum * divisor.denominator > 600) {
    return alert(
      `These pieces will be too small to display nicely. Please try a smaller whole number or a smaller denominator.`
    );
  } else if (dividend.wholeNum * divisor.denominator > 200) {
    actualLineThickness = actualLineThickness / 2;
  } else if (divisor.denominator > 24) {
    actualLineThickness = actualLineThickness / 2;
  } else if (divisor.denominator > 15) {
    actualLineThickness = actualLineThickness * 0.8;
  }

  let info = mixedNumCircles(
    svg,
    dividend,
    actualLineThickness,
    "gray",
    attributes.lineColor,
    width,
    height
  );
  radius = info.radius;
  horizontalSpacing = info.horizontalSpacing;
  verticalSpacing = info.verticalSpacing;
  width = info.width;
  currentX = radius + horizontalSpacing / 2;
  currentY = radius + verticalSpacing;
  startAngle = angleWherePiecesStart;
  let color = attributes.colorArray[0];
  let slicesToBeFilled = Math.floor(
    dividend.wholeNum * divisor.denominator +
      (dividend.numerator /
        dividend.denominator /
        (divisor.numerator / divisor.denominator)) *
        divisor.numerator
  );

  let currentPieceOfNumerator = 0;
  let currentPieceOfDenominator = 0;
  let numColors = findIdealNumColors(
    divisor.numerator,
    divisor.denominator,
    attributes.minNumColors
  );

  for (let i = 0; i < slicesToBeFilled; i++) {
    if (i == 0) {
      startAngle = angleWherePiecesStart;
    } else if (currentPieceOfDenominator >= divisor.denominator) {
      // If circle is fully shaded, draws the lines and moves to the next circle
      makeFractionLines(
        svg,
        currentX,
        currentY,
        radius,
        divisor.denominator,
        actualLineThickness,
        attributes.lineColor,
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
      startAngle = parseFloat(
        (startAngle + (1 / divisor.denominator) * Math.PI * 2).toFixed(2)
      );
    }

    let colorsArray = attributes.colorArray.slice(0, numColors);

    if (currentPieceOfNumerator >= divisor.numerator) {
      color = switchBetweenColors(color, colorsArray);
      currentPieceOfNumerator = 1;
    } else {
      currentPieceOfNumerator++;
    }
    debugger;
    shadeFractionSlices(
      svg,
      currentX,
      currentY,
      radius - actualLineThickness / 2,
      1,
      divisor.denominator,
      actualLineThickness,
      color,
      attributes.lineColor,
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
    divisor.denominator,
    actualLineThickness,
    attributes.lineColor,
    startAngle
  );
};

mathVisual.fractionDivisionOneCircle = (svg, dividend, divisor, attributes) => {
  let actualLineThickness = attributes.lineThickness;

  if (dividend.numerator > dividend.denominator) {
    return alert(
      `Currently this is only available for proper fractions. Make sure your numerator is less than or equal to your denominator.`
    );
  } else if (divisor.wholeNum > 35 || dividend.denominator > 35) {
    return alert(
      `Your denominator or divisor is too large to display nicely. Please try smaller numbers.`
    );
  } else if (divisor.wholeNum * dividend.denominator > 150) {
    return alert(
      `Your denominator or divisor is too large to display nicely. Please try smaller numbers.`
    );
  }
  let width = svg.getAttribute("width") - 10;
  const height = svg.getAttribute("height") - 10;
  const numerator = dividend.numerator;
  const denominator = dividend.denominator;
  const divisorWhole = divisor.wholeNum;
  if (width > height) {
    radius = height / 2;
  } else {
    radius = width / 2;
  }

  width = radius * 2 + 10;

  shadeFractionSlices(
    svg,
    radius + 5,
    radius + 5,
    radius,
    numerator,
    denominator,
    actualLineThickness,
    attributes.colorArray[1],
    attributes.lineColor,
    0
  );
  let color = attributes.colorArray[0];
  let angle = (Math.PI * 2) / denominator / divisorWhole;
  let largerPieceAngle = (Math.PI * 2) / denominator;
  let currentAngle = 0;

  for (let i = 0; i < numerator; i++) {
    shadeFractionSlices(
      svg,
      radius + 5,
      radius + 5,
      radius,
      1,
      denominator * divisorWhole,
      0,
      color,
      attributes.lineColor,
      currentAngle
    );
    currentAngle += largerPieceAngle;
  }

  makeFractionLines(
    svg,
    radius + 5,
    radius + 5,
    radius,
    denominator,
    actualLineThickness,
    attributes.lineColor,
    0
  );

  makeFractionLines(
    svg,
    radius + 5,
    radius + 5,
    radius,
    denominator * divisorWhole,
    actualLineThickness / 3,
    attributes.lineColor,
    0
  );

  drawCircle(
    svg,
    radius + 5,
    radius + 5,
    radius,
    actualLineThickness,
    "none",
    attributes.lineColor
  );
  svg.setAttribute("width", width);
};

mathVisual.fractionDivisionOneBar = (svg, dividend, divisor, attributes) => {
  let actualLineThickness = attributes.lineThickness;

  if (dividend.numerator > dividend.denominator) {
    return alert(
      `Currently this is only available for proper fractions. Make sure your numerator is less than or equal to your denominator.`
    );
  } else if (divisor.wholeNum > 35 || dividend.denominator > 35) {
    return alert(
      `Your denominator or divisor is too large to display nicely. Please try smaller numbers.`
    );
  } else if (divisor.wholeNum * dividend.denominator > 200) {
    return alert(
      `Your denominator or divisor is too large to display nicely. Please try smaller numbers.`
    );
  } else if (divisor.wholeNum * dividend.denominator > 75) {
    actualLineThickness = actualLineThickness / 2;
  }

  let spaceForLabels = 0;
  const width = svg.getAttribute("width") - 10;
  const height = svg.getAttribute("height") - 10 - spaceForLabels;
  const numerator = dividend.numerator;
  const denominator = dividend.denominator;
  const divisorWhole = divisor.wholeNum;

  drawVerticalFractionBar(
    svg,
    5,
    5,
    width,
    height,
    numerator,
    denominator,
    actualLineThickness,
    attributes.colorArray[1],
    attributes.colorArray[0]
  );

  let pieceWidth = width / denominator;
  let startX = 5;
  for (let i = 0; i < numerator; i++) {
    drawVerticalFractionBar(
      svg,
      startX,
      5,
      pieceWidth,
      height,
      1,
      divisorWhole,
      actualLineThickness / 2,
      attributes.colorArray[0],
      attributes.lineColor
    );
    startX += pieceWidth;
  }

  drawVerticalFractionBar(
    svg,
    5,
    5,
    width,
    height,
    numerator,
    denominator,
    actualLineThickness,
    "transparent",
    attributes.lineColor
  );
};
