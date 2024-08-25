mathVisual.fractionDivisionBar = (
  svg,
  dividend,
  divisor,
  lineThickness = 4,
  colorFill = "#347d88", //dark teal
  colorFill2 = " #b7dd82", // light faded green
  style = "bar"
) => {
  const spaceForLabels = 10;
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height") - spaceForLabels;
  const svgNS = svg.namespaceURI;
  let numSections = 0;

  // Need to add error handling for decimal, blank or negative inputs

  if (!dividend.wholeNum) {
    dividend.wholeNum = 0;
  } // If the wholeNum input is blank, the variable is set to 0.
  if (!dividend.numerator) {
    dividend.numerator = 0;
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
    lineThickness = lineThickness / 2;
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
        lineThickness * 2
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
  console.log(`slicesToBeFilled is ${slicesToBeFilled}`);

  let numSegments = Math.ceil(slicesToBeFilled / divisor.numerator);
  console.log(`numSegments is ${numSegments}`);
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
  console.log(`sizeOfLastPiece is ${sizeOfLastPiece}`);

  //color each section alternating colors
  for (let i = 1; i <= numSegments; i++) {
    const section = document.createElementNS(svgNS, "rect");
    if (i % 2 == 0) {
      section.setAttribute("fill", colorFill2);
    } else {
      section.setAttribute("fill", colorFill);
    }

    // Colors the last segment partially if it's not a whole group
    if (i == numSegments) {
      section.setAttribute("x", segmenter * i - segmenter);
      section.setAttribute("y", lineThickness * 2);
      section.setAttribute("width", sizeOfLastPiece);
      section.setAttribute("height", height - lineThickness * 2);
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
    firstDottedLine.setAttribute("y1", 0);
    firstDottedLine.setAttribute("x2", segmenter * (i - 1));
    firstDottedLine.setAttribute("y2", height);
    firstDottedLine.setAttribute("stroke", "black");
    firstDottedLine.setAttribute("stroke-width", lineThickness + 2);
    firstDottedLine.setAttribute("stroke-dasharray", "5, 5");
    svg.appendChild(firstDottedLine);
    // Dashed border which is invisible if the dividend is a whole number but shows the next integer up if the dividend is a mixed number
    const dottedRect = document.createElementNS(svgNS, "rect");
    dottedRect.setAttribute("x", lineThickness);
    dottedRect.setAttribute("y", lineThickness);
    dottedRect.setAttribute("width", width - lineThickness * 2);
    dottedRect.setAttribute("height", height);
    dottedRect.setAttribute("fill", "none");
    dottedRect.setAttribute("stroke", "black");
    dottedRect.setAttribute("stroke-width", lineThickness * 1.5);
    dottedRect.setAttribute("stroke-dasharray", "5, 5");
    svg.appendChild(dottedRect);

    // Create dashed lines to segment each iteration of the divisor
    const dottedLine = document.createElementNS(svgNS, "line");
    dottedLine.setAttribute("x1", segmenter * i);
    dottedLine.setAttribute("y1", 0);
    dottedLine.setAttribute("x2", segmenter * i);
    dottedLine.setAttribute("y2", height);
    dottedLine.setAttribute("stroke", "black");
    dottedLine.setAttribute("stroke-width", lineThickness + 2);
    dottedLine.setAttribute("stroke-dasharray", "5, 5");
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
    boldLine.setAttribute("stroke-width", lineThickness * 3);

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
  blackOutline.setAttribute("stroke-width", lineThickness * 3);
  blackOutline.setAttribute("fill", "none");
  blackOutline.setAttribute("stroke", "black");
  blackOutline.setAttribute("x", lineThickness);
  blackOutline.setAttribute("y", lineThickness);
  blackOutline.setAttribute("width", dividend.size);
  blackOutline.setAttribute("height", height);
  svg.appendChild(blackOutline);

  // // Create a new <g> element
  // const bracketGroup = document.createElementNS(svgNS, "g");
  // bracketGroup.setAttribute("style", "");
  // bracketGroup.setAttribute("transform", "matrix(1, 0, 0, 0.66, 0, 122.72)");

  // // Create the first <path> element
  // const pathElement1 = document.createElementNS(svgNS, "path");

  // pathElement1.setAttribute(
  //   "d",
  //   "M 66 281 C 69 308 86 314 111 318 C 148 323 188 312 223 329 C 241 338 234 357 240 367"
  // );

  // // Create the second <path> element
  // const pathElement2 = document.createElementNS(svgNS, "path");
  // pathElement2.setAttribute(
  //   "style",
  //   "transform-box: fill-box; transform-origin: 50% 50%;"
  // );
  // pathElement2.setAttribute(
  //   "d",
  //   "M 240 369 C 243 342 260 336 284 333 C 322 327 362 338 397 321 C 415 313 408 293 413 283"
  // );
  // pathElement2.setAttribute("transform", "  matrix(-1, 0, 0, -1, 0, 0)");

  // // Append the <path> elements to the <g> element
  // bracketGroup.appendChild(pathElement1);
  // bracketGroup.appendChild(pathElement2);

  // bracketGroup.setAttribute("stroke", "black");
  // bracketGroup.setAttribute("stroke-width", "4");
  // bracketGroup.setAttribute("fill", "none");
  // bracketGroup.setAttribute(
  //   "transform",
  //   "scale(2.27,0.7) translate(-63, -135)"
  // );

  // svg.appendChild(bracketGroup);

  // const dividendLabel = document.createElementNS(svgNS, "text");
  // dividendLabel.setAttribute("x", dividend / 2 - 40);
  // dividendLabel.setAttribute("y", "195");
  // dividendLabel.setAttribute("font-size", "30px");
  // dividendLabel.textContent = `${dividend.wholeNum} wholes`;
  // svg.appendChild(dividendLabel);
};

// This function is almost done! I just need to handle the last piece if only a partial group or piece can be drawn.
mathVisual.fractionDivisionCircles = (
  svg,
  dividend,
  divisor,
  lineThickness = 2,
  ...colors
) => {
  console.log(colors);
  // mixedNumCircles will draw the dividend.
  let width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  if (!dividend.wholeNum) {
    dividend.wholeNum = 0;
  } // If the wholeNum input is blank, the variable is set to 0.

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
  } else if (dividend.wholeNum == 0 && dividend.numerator == 0) {
    return alert(`Please enter a positive dividend.`);
  } else if (dividend.denominator == 0 || divisor.denominator == 0) {
    return alert(`All denominators must be positive.`);
  } else if (dividend.wholeNum * divisor.denominator > 600) {
    return alert(
      `These pieces will be too small to display nicely. Please try a smaller whole number or a smaller denominator.`
    );
  } else if (dividend.wholeNum * divisor.denominator > 200) {
    lineThickness = lineThickness / 2;
  }

  let info = mixedNumCircles(
    svg,
    dividend,
    lineThickness,
    "gray",
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
  let color = colorFill1;
  let slicesToBeFilled = Math.floor(
    dividend.wholeNum * divisor.denominator +
      (dividend.numerator /
        dividend.denominator /
        (divisor.numerator / divisor.denominator)) *
        divisor.numerator
  );

  let currentPieceOfNumerator = 0;
  let currentPieceOfDenominator = 0;

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
      startAngle = parseFloat(
        (startAngle + (1 / divisor.denominator) * Math.PI * 2).toFixed(2)
      );
    }

    let minGroupsPerCircle;
    let maxGroupsPerCircle;
    let numColors;

    if (divisor.denominator % divisor.numerator === 0) {
      minGroupsPerCircle = divisor.denominator / divisor.numerator;
      maxGroupsPerCircle = minGroupsPerCircle;
      numColors = findIdealNumColors(minGroupsPerCircle, maxGroupsPerCircle, 2);
      // numColors = ((divisor.denominator / divisor.numerator) % 2) + 2;
      console.log("Easier case");
    } else {
      minGroupsPerCircle = Math.ceil(divisor.denominator / divisor.numerator);
      maxGroupsPerCircle = minGroupsPerCircle + 1;
      numColors = findIdealNumColors(minGroupsPerCircle, maxGroupsPerCircle, 2);
      console.log(`Harder case: numColors is ${numColors}`);
    }

    let colorsArray = [];

    for (let i = 0; i < numColors; i++) {
      colorsArray[i] = colors[i];
    }
    console.log(`colorsArray is ${colorsArray}`);

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
      radius - lineThickness / 2,
      1,
      divisor.denominator,
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
    divisor.denominator,
    lineThickness,
    startAngle
  );
};

mathVisual.fractionDivisionOneCircle = (
  svg,
  dividend,
  divisor,
  lineThickness = 5,
  colorFill = "#52a4b0"
) => {
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
    lineThickness,
    "rgb(205, 205, 205)",
    0
  );
  let color = colorFill;
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
    lineThickness,
    0
  );

  makeFractionLines(
    svg,
    radius + 5,
    radius + 5,
    radius,
    denominator * divisorWhole,
    lineThickness / 3,
    0
  );

  drawCircle(
    svg,
    radius + 5,
    radius + 5,
    radius,
    lineThickness,
    (lineColor = "black"),
    (fillColor = "none")
  );
  svg.setAttribute("width", width);
};

mathVisual.fractionDivisionOneBar = (
  svg,
  dividend,
  divisor,
  lineThickness = 5,
  colorFill = "#52a4b0"
) => {
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
    lineThickness = lineThickness / 2;
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
    lineThickness,
    "rgb(205, 205, 205)"
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
      lineThickness / 2,
      colorFill
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
    lineThickness + 2,
    "transparent"
  );
};
