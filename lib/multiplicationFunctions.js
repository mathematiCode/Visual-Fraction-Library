mathVisual.fractionMultiplicationAreaModel = (
  svg,
  factor1,
  factor2,
  lineThickness = 5,
  colorFill = "hsla(188, 37%, 51%,70%)",
  colorFill2 = "hsla(96, 70%, 66%,50%)",
  toScale = true
) => {
  let width = svg.getAttribute("width") - 10;
  let height = svg.getAttribute("height") - 10;

  factor1.maxWholes =
    factor1.numerator === 0 ? factor1.wholeNum : factor1.wholeNum + 1;
  factor2.maxWholes =
    factor2.numerator === 0 ? factor2.wholeNum : factor2.wholeNum + 1;

  let factor1ShouldBeTheWidth =
    isFactor1GreaterThanOrEqualToFactor2(factor1, factor2) && width >= height;

  let adjustToScale;
  let centerStartX = 0;
  let centerStartY = 0;

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
    centerStartX = adjustToScale.centerStartX;
    centerStartY = adjustToScale.centerStartY;
  }

  let lastWholeStartLineX;
  let lastWholeStartLineY;
  lastWholeStartLineX = width - width / (factor1.wholeNum + 1) + centerStartX;
  lastWholeStartLineY = height - height / (factor2.wholeNum + 1);

  if (factor1.wholeNum == 0 && factor2.wholeNum == 0) {
    let maxSideLength = Math.min(width, height) - 10;

    if (!toScale) {
      centerStartX = (width - maxSideLength) / 2;
      centerStartY = (height - maxSideLength) / 2;
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
