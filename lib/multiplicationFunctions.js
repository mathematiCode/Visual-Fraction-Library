mathVisual.fractionMultiplicationAreaModel = (
  svg,
  factor1,
  factor2,
  attributes
) => {
  // Changes any blank inputs to 0.
  for (const key in factor1) {
    if (!factor1[key]) {
      factor1[key] = 0;
    }
  }
  for (const key in factor2) {
    if (!factor2[key]) {
      factor2[key] = 0;
    }
  }

  let actualLineThickness = attributes.lineThickness;
  if (
    factor1.wholeNum < 0 ||
    factor1.numerator < 0 ||
    factor1.denominator < 0 ||
    factor2.wholeNum < 0 ||
    factor2.numerator < 0 ||
    factor2.denominator < 0
  ) {
    return alert(
      `Please enter a positive number in each box or leave it blank.`
    );
  } else if (
    (factor1.wholeNum === NaN &&
      factor1.numerator === NaN &&
      factor1.denominator === NaN) ||
    (factor2.wholeNum === NaN &&
      factor2.numerator === NaN &&
      factor2.denominator === NaN) ||
    (factor1.wholeNum === NaN && factor1.numerator === NaN) ||
    (factor2.wholeNum === NaN && factor2.numerator === NaN) ||
    (factor1.wholeNum === NaN && factor1.denominator === NaN) ||
    (factor2.wholeNum === NaN && factor2.denominator === NaN)
  ) {
    return;
  } else if (
    (factor1.wholeNum === 0 &&
      factor1.numerator === 0 &&
      factor1.denominator === 0) ||
    (factor2.wholeNum === 0 &&
      factor2.numerator === 0 &&
      factor2.denominator === 0)
  ) {
    return;
  } else if (
    factor1.numerator > factor1.denominator ||
    factor2.numerator > factor2.denominator
  ) {
    return alert(
      `Please make sure your numerators are less than or equal to your denominators.`
    );
  } else if (
    factor1.wholeNum * factor1.denominator > 200 ||
    factor2.wholeNum * factor2.denominator > 200
  ) {
    return alert(
      `These factors are too large to display properly. Please use smaller numbers.`
    );
  } else if (
    factor1.wholeNum * factor1.denominator > 90 ||
    factor2.wholeNum * factor2.denominator > 90
  ) {
    actualLineThickness = actualLineThickness / 2;
  }
  let width = svg.getAttribute("width") - 10;
  let height = svg.getAttribute("height") - 10;

  factor1.maxWholes =
    factor1.numerator === 0 ? factor1.wholeNum : factor1.wholeNum + 1;
  factor2.maxWholes =
    factor2.numerator === 0 ? factor2.wholeNum : factor2.wholeNum + 1;

  let factor1ShouldBeTheWidth =
    isFactor1GreaterThanOrEqualToFactor2(factor1, factor2) && width >= height;

  let adjustToScale;
  let centerStartX = 5;
  let centerStartY = 5;

  // Switches factors so that factor1 now SHOULD be the width
  if (!factor1ShouldBeTheWidth) {
    let factor3 = {};
    factor3.wholeNum = factor2.wholeNum;
    factor3.numerator = factor2.numerator;
    factor3.denominator = factor2.denominator;
    factor3.maxWholes = factor2.maxWholes;
    factor2.wholeNum = factor1.wholeNum;
    factor2.numerator = factor1.numerator;
    factor2.denominator = factor1.denominator;
    factor2.maxWholes = factor1.maxWholes;
    factor1.wholeNum = factor3.wholeNum;
    factor1.numerator = factor3.numerator;
    factor1.denominator = factor3.denominator;
    factor1.maxWholes = factor3.maxWholes;
  }

  if (attributes.toScale == true) {
    adjustToScale = adjustWidthAndHeightToScale(
      factor1.maxWholes,
      factor2.maxWholes,
      width,
      height
    );
    width = adjustToScale.width;
    height = adjustToScale.height;
    centerStartX = 5;
    centerStartY = adjustToScale.centerStartY + 5;
  }

  let lastWholeStartLineX =
    width - width / (factor1.wholeNum + 1) + centerStartX;
  let lastWholeStartLineY =
    height - height / (factor2.wholeNum + 1) + centerStartY;
  svg.setAttribute("width", width + 10);
  svg.setAttribute("height", height + 10);

  if (factor1.wholeNum === 0 && factor2.wholeNum === 0) {
    let maxSideLength = Math.min(width, height);

    centerStartX = (width - maxSideLength) / 2 + 5;
    centerStartY = (height - maxSideLength) / 2 + 5;

    drawVerticalFractionBar(
      svg,
      centerStartX,
      centerStartY,
      maxSideLength,
      maxSideLength,
      factor1.numerator,
      factor1.denominator,
      actualLineThickness,
      attributes.colorArray[0],
      attributes.lineColor,
      "none",
      attributes.opacity1
    );

    drawHorizontalFractionBar(
      svg,
      centerStartX,
      centerStartY,
      maxSideLength,
      maxSideLength,
      factor2.numerator,
      factor2.denominator,
      actualLineThickness,
      attributes.colorArray[1],
      attributes.lineColor,
      attributes.opacity2
    );

    // Draws the separator lines again on top so they aren't under the second overlay
    drawVerticalFractionBar(
      svg,
      centerStartX,
      centerStartY,
      maxSideLength,
      maxSideLength,
      factor1.numerator,
      factor1.denominator,
      actualLineThickness,
      "none",
      attributes.lineColor,
      "none",
      1
    );
    return;
  }

  if (factor2.wholeNum == 0) {
    lastWholeStartLineY = centerStartY;
  }

  if (factor1.wholeNum === 0) {
    lastWholeStartLineX = centerStartX;
  }

  // Shades wholeNum for factor1
  drawVerticalFractionBar(
    svg,
    centerStartX,
    centerStartY,
    width,
    height,
    factor1.wholeNum,
    factor1.maxWholes,
    actualLineThickness,
    attributes.colorArray[0],
    "none",
    "none",
    attributes.opacity1
  );
  // if there is a fraction, shades that portion
  if (factor1.numerator > 0) {
    drawVerticalFractionBar(
      svg,
      lastWholeStartLineX,
      centerStartY,
      width / factor1.maxWholes,
      height,
      factor1.numerator,
      factor1.denominator,
      actualLineThickness,
      attributes.colorArray[0],
      attributes.lineColor,
      "none",
      attributes.opacity1
    );
  }

  // shades the wholeNum for factor2
  drawHorizontalFractionBar(
    svg,
    centerStartX,
    centerStartY,
    width,
    height,
    factor2.wholeNum,
    factor2.maxWholes,
    actualLineThickness,
    attributes.colorArray[1],
    attributes.lineColor,
    attributes.opacity2
  );
  //if there is a fraction in factor2, this shades that part
  if (factor2.maxWholes > factor2.wholeNum) {
    drawHorizontalFractionBar(
      svg,
      centerStartX,
      lastWholeStartLineY,
      width,
      height / factor2.maxWholes,
      factor2.numerator,
      factor2.denominator,
      actualLineThickness,
      attributes.colorArray[1],
      attributes.lineColor,
      attributes.opacity2
    );
  }
  // Draws the separator lines again on top so they aren't under the second overlay
  drawVerticalFractionBar(
    svg,
    centerStartX,
    centerStartY,
    width,
    height,
    factor1.wholeNum,
    factor1.maxWholes,
    actualLineThickness,
    "none",
    attributes.lineColor,
    "none",
    0
  );

  if (factor1.numerator > 0) {
    drawVerticalFractionBar(
      svg,
      lastWholeStartLineX,
      centerStartY,
      width / factor1.maxWholes,
      height,
      factor1.numerator,
      factor1.denominator,
      actualLineThickness,
      "none",
      attributes.lineColor,
      "none",
      0
    );
  }
};

mathVisual.fractionMultiplicationGroupModel = (
  svg,
  factor1,
  factor2,
  attributes
) => {
  // Changes any blank inputs to 0.
  for (const key in factor1) {
    if (!factor1[key]) {
      factor1[key] = 0;
    }
  }
  for (const key in factor2) {
    if (!factor2[key]) {
      factor2[key] = 0;
    }
  }

  let actualLineThickness = attributes.lineThickness;

  if (
    factor1.wholeNum === 0 &&
    factor1.numerator === 0 &&
    factor1.denominator === 0 &&
    factor2.wholeNum === 0
  ) {
    return;
  } else if (
    factor1.wholeNum < 0 ||
    factor1.numerator < 0 ||
    factor1.denominator < 0 ||
    factor2.wholeNum < 0
  ) {
    return alert(
      `Please enter a positive number in each box or leave it blank.`
    );
  } else if (
    (factor1.wholeNum === 0 && factor1.numerator === 0) ||
    factor1.denominator === 0 ||
    factor2.wholeNum === 0
  ) {
    return;
  } else if (factor1.numerator > factor1.denominator) {
    return alert(
      `Please make sure your numerator is less than your denominator.`
    );
  } else if (
    factor1.wholeNum > 41 ||
    factor2.wholeNum > 25 ||
    factor1.wholeNum * factor1.denominator > 300 ||
    factor1.wholeNum * factor2.wholeNum > 400
  ) {
    return alert(
      `These factors are too large to display properly. Please use smaller numbers.`
    );
  } else if (
    factor1.wholeNum * factor1.denominator > 40 ||
    factor1.wholeNum * factor2.wholeNum > 100 ||
    factor1.wholeNum > 20 ||
    factor2.wholeNum > 20
  ) {
    actualLineThickness = actualLineThickness / 2;
  }

  let width = svg.getAttribute("width") - 10;
  let height = svg.getAttribute("height") - 10;

  factor1.maxWholes =
    factor1.numerator === 0 ? factor1.wholeNum : factor1.wholeNum + 1;

  if (factor1.maxWholes >= factor2.wholeNum * 1.6) {
    let numRows = factor2.wholeNum;
    let lineHeight = height / numRows;

    for (let i = 0; i < numRows; i++) {
      mixedNumCirclesHorizontal(
        svg,
        factor1,
        actualLineThickness,
        attributes.colorArray[0],
        attributes.lineColor,
        width,
        lineHeight * 0.7, //height
        5, // startX
        i * lineHeight, //startY
        attributes.borderIsShowing //border Bool
      );
      debugger;
    }
  } else {
    let columnWidth = width / factor2.wholeNum;

    for (let i = 0; i < factor2.wholeNum; i++) {
      mixedNumCirclesVertical(
        svg,
        factor1,
        actualLineThickness,
        attributes.colorArray[0],
        attributes.lineColor,
        columnWidth - 10,
        height,
        i * columnWidth,
        5,
        attributes.borderIsShowing
      );
    }
  }
};
