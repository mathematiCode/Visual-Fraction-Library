// This is remnants of messy code I've since fixed.

// for (let i = 0; i < slicesToBeFilled; i++) {
//   if (currentPieceOfNumerator >= numerator2) {
//     color = switchBetweenColors(color, colorFill, colorFill2, colorFill3);
//     currentPieceOfNumerator = 0;
//     if (currentPieceOfDenominator >= denominator2) {
//       // If circle is fully shaded, draws the lines and moves to the next circle
//       makeFractionLines(
//         svg,
//         currentX,
//         currentY,
//         radius,
//         denominator2,
//         lineThickness,
//         startAngle
//       );
//       currentX = currentX + radius * 2 + horizontalSpacing;
//       currentPieceOfDenominator = 0;
//       if (currentX + radius >= width) {
//         currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the next line if we run out of space
//         currentX = radius + horizontalSpacing / 2;
//         startAngle = angleWherePiecesStart;
//       }
//     } else {
//       // if there are still pieces left to shade on the current circle
//       startAngle = startAngle + (1 / denominator2) * Math.PI * 2;
//     }
//   } else {
//     if (currentPieceOfDenominator >= denominator2) {
//       makeFractionLines(
//         svg,
//         currentX,
//         currentY,
//         radius,
//         denominator2,
//         lineThickness,
//         startAngle
//       );
//       currentX = currentX + radius * 2 + horizontalSpacing;
//       currentPieceOfDenominator = 0;
//       if (currentX + radius >= width) {
//         currentY = currentY + radius * 2 + verticalSpacing; // Moves the remaining circles to the next line if we run out of space
//         currentX = radius + horizontalSpacing / 2;
//         startAngle = angleWherePiecesStart;
//       }
//     } else {
//       startAngle = startAngle + (1 / denominator2) * Math.PI * 2;
//     }
//   }
//   shadeFractionSlices(
//     svg,
//     currentX,
//     currentY,
//     radius - lineThickness / 2,
//     1,
//     denominator2,
//     lineThickness,
//     color,
//     startAngle
//   );

//   currentPieceOfNumerator++;
//   currentPieceOfDenominator++;
// }

// mathVisual.fractionMultiplicationAreaModel = (
//   svg,
//   wholeNum1,
//   numerator1,
//   denominator1,
//   wholeNum2,
//   numerator2,
//   denominator2,
//   lineThickness = 5,
//   colorFill = "hsla(188, 37%, 51%,70%)",
//   colorFill2 = "hsla(96, 70%, 66%,50%)"
// ) => {
//   const width = svg.getAttribute("width");
//   const height = svg.getAttribute("height");
//   maxSideLength = Math.min(width, height) - 10;
//   let verticalInterval = 0;
//   let horizontalInterval = 0;
//   debugger;
//   if (wholeNum1 === 0 && wholeNum2 === 0) {
//     verticalInterval = maxSideLength / denominator1;
//     horizontalInterval = maxSideLength / denominator2;
//     debugger;
//     drawVerticalFractionBar(
//       svg,
//       0,
//       0,
//       maxSideLength,
//       maxSideLength,
//       numerator1,
//       denominator1,
//       lineThickness,
//       colorFill
//     );

//     drawHorizontalFractionBar(
//       svg,
//       0,
//       0,
//       maxSideLength,
//       maxSideLength,
//       numerator2,
//       denominator2,
//       lineThickness,
//       colorFill2
//     );

//     // Draws the separator lines again on top so they aren't under the second overlay
//     drawVerticalFractionBar(
//       svg,
//       0,
//       0,
//       maxSideLength,
//       maxSideLength,
//       numerator1,
//       denominator1,
//       lineThickness,
//       "none"
//     );
//   } else if (wholeNum1 > wholeNum2) {
//     if (numerator1 > 0) {
//       drawVerticalFractionBar(
//         svg,
//         0,
//         lineThickness,
//         width - 10,
//         height - 10,
//         wholeNum1,
//         wholeNum1 + 1,
//         lineThickness + 3,
//         colorFill
//       );
//       drawVerticalFractionBar(
//         svg,
//         (width - 10) * (wholeNum1 / (wholeNum1 + 1)) + lineThickness,
//         lineThickness + 3,
//         width / (wholeNum1 + 1),
//         height - lineThickness - 10,
//         numerator1,
//         denominator1,
//         lineThickness * 0.5,
//         colorFill
//       );
//       if (wholeNum2 > 0 && numerator2 > 0) {
//         drawHorizontalFractionBar(
//           svg,
//           0,
//           0,
//           width - 10,
//           height,
//           wholeNum2,
//           wholeNum2 + 1,
//           lineThickness + 3,
//           colorFill2
//         );
//         drawHorizontalFractionBar(
//           svg,
//           lineThickness + 3,
//           height * (wholeNum2 / (wholeNum2 + 1)),
//           width - 10 - lineThickness,
//           height / (wholeNum2 + 1),
//           numerator2,
//           denominator2,
//           lineThickness * 0.5,
//           colorFill2
//         );
//       } else if (wholeNum2 == 0 && numerator2 > 0) {
//         drawHorizontalFractionBar(
//           svg,
//           lineThickness + 3,
//           0,
//           width - 10 - lineThickness,
//           height,
//           numerator2,
//           denominator2,
//           lineThickness * 0.5,
//           colorFill2
//         );
//       }
//       drawVerticalFractionBar(
//         svg,
//         0,
//         lineThickness,
//         width - 10,
//         height - 10,
//         wholeNum1,
//         wholeNum1 + 1,
//         lineThickness + 3,
//         "none"
//       );
//       drawVerticalFractionBar(
//         svg,
//         (width - 10) * (wholeNum1 / (wholeNum1 + 1)) + lineThickness,
//         lineThickness + 3,
//         width / (wholeNum1 + 1),
//         height - lineThickness - 10,
//         numerator1,
//         denominator1,
//         lineThickness * 0.7,
//         "none"
//       );
//     }
//   } else if (wholeNum2 > wholeNum1) {
//   }
// };
