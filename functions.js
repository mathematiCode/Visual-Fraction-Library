mathVisual.fractionMultiplicationAreaModel = (
  svg,
  factor1,
  factor2,
  lineThickness = 5,
  colorFill = "hsla(188, 37%, 51%,70%)",
  colorFill2 = "hsla(96, 70%, 66%,50%)"
) => {
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  maxSideLength = Math.min(width, height) - 10;

  if (factor1.wholeNum == 0 && factor2.wholeNum == 0) {
    drawVerticalFractionBar(
      svg,
      0,
      0,
      maxSideLength,
      maxSideLength,
      factor1.numerator,
      factor1.denominator,
      lineThickness,
      colorFill
    );

    drawHorizontalFractionBar(
      svg,
      0,
      0,
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
      0,
      0,
      maxSideLength,
      maxSideLength,
      numerator1,
      denominator1,
      lineThickness,
      "none"
    );
    return;
  }

  let factor1ShouldBeTheWidth =
    (isFactor1LargerThanFactor2 && width >= height) ||
    (!isFactor1GreaterThanOrEqualToFactor2 && height >= width);
  if (factor1ShouldBeTheWidth) {
    let lastWholeStartLineX = width - width / (factor1.wholeNum + 1);
    let lastWholeStartLineY = height - height / (factor2.wholeNum + 1);
  } else {
    let lastWholeStartLineY = height - height / (factor1.wholeNum + 1);
    let lastWholeStartLineX = width - width / (factor2.wholeNum + 1);
  }

  factor1.maxWholes =
    factor1.numerator === 0 ? factor1.wholeNum : factor1.wholeNum + 1;
  factor2.maxWholes =
    factor2.numerator === 0 ? factor2.wholeNum : factor2.wholeNum + 1;

  if (factor1ShouldBeTheWidth) {
    drawVerticalFractionBar(
      svg,
      0,
      0,
      width,
      height,
      factor1.wholeNum,
      factor1.maxWholes,
      lineThickness,
      colorFill
    );
    if (factor1.maxWholes > factor1.wholeNum) {
      drawVerticalFractionBar(
        svg,
        lastWholeStartLineX,
        0,
        width / factor1.maxWholes,
        height,
        factor1.numerator,
        factor1.denominator,
        lineThickness,
        colorFill
      );
    }
    drawHorizontalFractionBar(
      svg,
      0,
      0,
      width,
      height,
      factor2.wholeNum,
      factor2.maxWholes,
      lineThickness,
      colorFill2
    );
    if (factor2.maxWholes > factor2.wholeNum) {
      drawHorizontalFractionBar(
        svg,
        0,
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
      0,
      0,
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
      0,
      width / factor1.maxWholes,
      height,
      factor1.numerator,
      factor1.denominator,
      lineThickness,
      "none"
    );
  }
};

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
