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
    boldLine.setAttribute("stroke-width", lineThickness * 2);

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
  let info = mixedNumCircles(
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
  startAngle = angleWherePiecesStart;
  let color = colorFill;
  let slicesToBeFilled = Math.floor(
    wholeNum1 * denominator2 +
      (numerator1 / denominator1 / (numerator2 / denominator2)) * numerator2
  );
  // let quotientFloor = Math.floor(slicesToBeFilled / numerator2);
  // console.log(
  //   `Slices to be filled is ${slicesToBeFilled}, quotientFloor is ${quotientFloor}`
  // );

  drawAndShadeGroups(
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
  );

  // makeFractionLines(
  //   svg,
  //   currentX,
  //   currentY,
  //   radius,
  //   denominator2,
  //   lineThickness,
  //   startAngle
  // );
};
