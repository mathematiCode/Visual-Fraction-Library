mathVisual.fractionBar = (svg, mixedNum, attributes) => {
  let width = svg.getAttribute("width") - attributes.lineThickness * 2;
  const height = svg.getAttribute("height") - attributes.lineThickness * 2;

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
    mixedNumBars(
      svg,
      mixedNum.wholeNum,
      mixedNum.numerator,
      mixedNum.denominator,
      attributes.lineThickness / 2,
      attributes.fillColor,
      attributes.borderColor
    );
  } else if (
    mixedNum.wholeNum > 0 ||
    mixedNum.numerator > mixedNum.denominator
  ) {
    mixedNumBars(
      svg,
      mixedNum.wholeNum,
      mixedNum.numerator,
      mixedNum.denominator,
      attributes.lineThickness,
      attributes.fillColor,
      attributes.borderColor
    );
  } else {
    drawVerticalFractionBar(
      svg,
      attributes.lineThickness, // for startX
      attributes.lineThickness, // for startY
      width,
      height,
      mixedNum.numerator,
      mixedNum.denominator,
      attributes.lineThickness,
      attributes.fillColor,
      attributes.borderColor,
      "transparent"
    );
  }
};

mathVisual.fractionCircle = (svg, mixedNum, attributes) => {
  attributes.width = svg.getAttribute("width");
  attributes.height = svg.getAttribute("height");

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
    attributes.lineThickness = attributes.lineThickness / 2;
    return;
  } else if (mixedNum.wholeNum * mixedNum.denominator > 900) {
    attributes.lineThickness = attributes.lineThickness / 4;
  } else if (mixedNum.wholeNum * mixedNum.denominator > 350) {
    attributes.lineThickness = attributes.lineThickness / 2;
  }
  if (mixedNum.numerator > mixedNum.denominator || mixedNum.wholeNum > 0) {
    mixedNumCircles(
      svg,
      mixedNum,
      attributes.lineThickness,
      attributes.fillColor,
      attributes.borderColor,
      attributes.width,
      attributes.height
    );
    return;
  }
  let radius = 0;
  if (attributes.width <= attributes.height) {
    radius = attributes.width / 2;
  } else {
    radius = attributes.height / 2;
  }
  attributes.width = 2 * radius + 10;
  // Set the circle properties
  const x = width / 2; // x-coordinate of the center
  const y = height / 2; // y-coordinate of the center

  if (mixedNum.numerator === mixedNum.denominator) {
    drawCircle(
      svg,
      x,
      y,
      radius - attributes.lineThickness,
      attributes.lineThickness,
      attributes.fillColor,
      attributes.borderColor
    );
  } else {
    drawCircle(
      svg,
      x,
      y,
      radius - attributes.lineThickness,
      attributes.lineThickness,
      "transparent",
      attributes.borderColor
    ); // Draws the outer circle
  }
  shadeFractionSlices(
    svg,
    x,
    y,
    radius - attributes.lineThickness / 2 - attributes.lineThickness,
    mixedNum.numerator,
    mixedNum.denominator,
    attributes.lineThickness,
    attributes.fillColor,
    attributes.borderColor,
    angleWherePiecesStart
  ); // Shades in the fraction portion and draws lines to show each slice
  makeFractionLines(
    svg,
    x,
    y,
    radius - attributes.lineThickness,
    mixedNum.denominator,
    attributes.lineThickness,
    attributes.borderColor
  );

  svg.setAttribute("width", attributes.width);
};
