function adjustWidthAndHeightToScale(maxWholes1, maxWholes2, width, height) {
  let wholeSize;
  let centerStartX;
  let centerStartY;

  let factor1ShouldBeTheWidth =
    (isFactor1GreaterThanOrEqualToFactor2 && width >= height) ||
    (!isFactor1GreaterThanOrEqualToFactor2 && height >= width);

  if (factor1ShouldBeTheWidth) {
    wholeSize = max(width / maxWholes1, height / maxWholes2);
    width = wholeSize * maxWholes1;
    height = wholeSize * maxWholes2;
  } else {
    wholeSize = max(height / maxWholes1, width / maxWholes2);
    width = wholeSize * maxWholes2;
    height = wholeSize * maxWholes1;
  }
}
