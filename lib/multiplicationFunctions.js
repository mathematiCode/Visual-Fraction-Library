mathVisual.fractionMultiplicationAreaModel = (
  svg,
  factor1,
  factor2,
  lineThickness = 5,
  colorFill = "hsla(188, 37%, 51%,70%)",
  colorFill2 = "hsla(96, 70%, 66%,50%)",
  toScale = true
) => {
  // Changes any blank inputs to 0.
  for (const key in factor1) {
    if (!factor1[key]) {
      factor1[key] = 0;
      console.log(`${key}changed to ${factor1[key]}`);
    }
  }
  for (const key in factor2) {
    if (!factor2[key]) {
      factor2[key] = 0;
    }
  }

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
    factor1.wholeNum === 0 ||
    factor1.numerator === 0 ||
    factor1.denominator === 0 ||
    factor2.wholeNum === 0 ||
    factor2.numerator === 0 ||
    factor2.denominator === 0
  ) {
    return;
  } else if (
    factor1.numerator > factor1.denominator ||
    factor2.numerator > factor2.denominator
  ) {
    return alert(
      `Please make sure your numerators are less than your denominators.`
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
    lineThickness = lineThickness / 2;
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

  if (toScale == true) {
    adjustToScale = adjustWidthAndHeightToScale(
      factor1.maxWholes,
      factor2.maxWholes,
      width,
      height
    );
    width = adjustToScale.width;
    height = adjustToScale.height;
    centerStartX = adjustToScale.centerStartX + 5;
    centerStartY = adjustToScale.centerStartY + 5;
  }

  let lastWholeStartLineX =
    width - width / (factor1.wholeNum + 1) + centerStartX;
  let lastWholeStartLineY =
    height - height / (factor2.wholeNum + 1) + centerStartY;

  if (factor1.wholeNum == 0 && factor2.wholeNum == 0)
    if (factor1.wholeNum == 0 && factor2.wholeNum == 0) {
      let maxSideLength = Math.min(width, height);

      if (!toScale) {
        centerStartX = (width - maxSideLength) / 2 + 5;
        centerStartY = (height - maxSideLength) / 2 + 5;
      }

      drawVerticalFractionBar(
        svg,
        centerStartX,
        centerStartY,
        maxSideLength,
        maxSideLength,
        factor1.numerator,
        factor1.denominator,
        lineThickness,
        colorFill
      );

      drawHorizontalFractionBar(
        svg,
        centerStartX,
        centerStartY,
        maxSideLength,
        maxSideLength,
        factor2.numerator,
        factor2.denominator,
        lineThickness,
        colorFill2
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
        lineThickness,
        "none"
      );
      return;
    }

  if (factor2.wholeNum == 0) {
    lastWholeStartLineY = centerStartY;
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
    lineThickness,
    colorFill
  );
  // if there is a fraction, shades that portion
  if (factor1.maxWholes > factor1.wholeNum) {
    drawVerticalFractionBar(
      svg,
      lastWholeStartLineX,
      centerStartY,
      width / factor1.maxWholes,
      height,
      factor1.numerator,
      factor1.denominator,
      lineThickness,
      colorFill
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
    lineThickness,
    colorFill2
  );
  //if there is a fraction in factor2, shades that part
  if (factor2.maxWholes > factor2.wholeNum) {
    drawHorizontalFractionBar(
      svg,
      centerStartX,
      lastWholeStartLineY,
      width,
      height / factor2.maxWholes,
      factor2.numerator,
      factor2.denominator,
      lineThickness,
      colorFill2
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
    lineThickness,
    "none"
  );
  drawVerticalFractionBar(
    svg,
    lastWholeStartLineX,
    centerStartY,
    width / factor1.maxWholes,
    height,
    factor1.numerator,
    factor1.denominator,
    lineThickness,
    "none"
  );
};

mathVisual.fractionMultiplicationGroupModel = (
  svg,
  factor1,
  factor2,
  lineThickness = 5,
  colorFill = "hsl(188, 37%, 40%)",
  borderIsShowing
) => {
  // Changes any blank inputs to 0.
  for (const key in factor1) {
    if (!factor1[key]) {
      factor1[key] = 0;
      console.log(`${key}changed to ${factor1[key]}`);
    }
  }
  for (const key in factor2) {
    if (!factor2[key]) {
      factor2[key] = 0;
    }
  }

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
    lineThickness = lineThickness / 2;
  }

  let width = svg.getAttribute("width") - 10;
  let height = svg.getAttribute("height") - 10;

  factor1.maxWholes =
    factor1.numerator === 0 ? factor1.wholeNum : factor1.wholeNum + 1;
  let color = colorFill;

  if (factor1.maxWholes >= factor2.wholeNum * 1.4) {
    let numRows = factor2.wholeNum;
    let lineHeight = height / numRows;

    for (let i = 0; i < numRows; i++) {
      mixedNumCirclesHorizontal(
        svg,
        factor1,
        lineThickness,
        color,
        width,
        lineHeight - 10,
        5,
        i * lineHeight,
        borderIsShowing
      );
    }
  } else {
    let numRows = factor1.maxWholes;
    let columnWidth = width / factor2.wholeNum;

    for (let i = 0; i < factor2.wholeNum; i++) {
      mixedNumCirclesVertical(
        svg,
        factor1,
        lineThickness,
        color,
        columnWidth - 10,
        height,
        i * columnWidth,
        5,
        borderIsShowing
      );
    }
  }
};
