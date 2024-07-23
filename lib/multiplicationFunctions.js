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
  let maxSideLength = Math.min(width, height) - 10;
  factor1.maxWholes =
    factor1.numerator === 0 ? factor1.wholeNum : factor1.wholeNum + 1;
  factor2.maxWholes =
    factor2.numerator === 0 ? factor2.wholeNum : factor2.wholeNum + 1;

  let adjustToScale;
  let centerStartX;
  let centerStartY;

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

  if (factor1.wholeNum == 0 && factor2.wholeNum == 0) {
    centerStartX = (width - maxSideLength) / 2;
    centerStartY = (height - maxSideLength) / 2;

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

  let factor1ShouldBeTheWidth =
    (isFactor1GreaterThanOrEqualToFactor2 && width >= height) ||
    (!isFactor1GreaterThanOrEqualToFactor2 && height >= width);
  debugger;
  let lastWholeStartLineX;
  let lastWholeStartLineY;
  if (factor1ShouldBeTheWidth) {
    lastWholeStartLineX = width - width / (factor1.wholeNum + 1) + centerStartX;
    lastWholeStartLineY = height - height / (factor2.wholeNum + 1);
  } else {
    lastWholeStartLineY = height - height / (factor1.wholeNum + 1);
    lastWholeStartLineX = width - width / (factor2.wholeNum + 1);
  }

  if (factor1ShouldBeTheWidth) {
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
  }
};
