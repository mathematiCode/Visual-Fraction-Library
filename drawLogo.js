function shadeSlicesForLogo(
  svg,
  x,
  y,
  radius,
  numerator,
  denominator,
  lineThickness,
  colorFill,
  startAngle = angleWherePiecesStart
) {
  const svgNS = svg.namespaceURI;
  const angle = (Math.PI * 2) / denominator;
  let previousAngle = startAngle;
  let currentAngle = startAngle + angle;

  for (let i = 0; i < numerator; i++) {
    const curvedPath = document.createElementNS(svgNS, "path");
    const startX = x + radius * Math.cos(previousAngle);
    const startY = y + radius * Math.sin(previousAngle);
    const endX = x + radius * Math.cos(currentAngle);
    const endY = y + radius * Math.sin(currentAngle);
    curvedPath.setAttribute("fill", colorFill);
    curvedPath.setAttribute(
      "d",
      `
        M ${x},${y} 
        L ${startX},${startY} 
        A ${radius},${radius} 0 0 1 ${endX},${endY} 
        Z
      `
    );
    svg.appendChild(curvedPath);
    previousAngle = currentAngle;
    currentAngle += angle;
  }
}

function makeFractionLines(
  svg,
  x,
  y,
  radius,
  denominator,
  lineThickness,
  startAngle = angleWherePiecesStart
) {
  const angle = (Math.PI * 2) / denominator;
  let currentAngle = startAngle;

  for (let i = 0; i < denominator; i++) {
    const svgNS = svg.namespaceURI;
    const line = document.createElementNS(svgNS, "line");
    const startX = x + radius * Math.cos(currentAngle);
    const startY = y + radius * Math.sin(currentAngle);
    const endX = x;
    const endY = y;

    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", lineThickness);
    svg.appendChild(line);

    currentAngle += angle;
  }
}

let lightGreen = "hsl(78, 61%, 81%,70%)";
let peach = "hsl(10, 78%, 82%, 70%)";
let teal = "hsl(183, 48%, 86%,70%)";
let orange = "hsl(33, 86%, 81%, 70%)";

let logosvg = document.getElementById("logo-svg");

function drawLogo(svg) {
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");

  shadeSlicesForLogo(svg, 200, 200, 140, 1, 7, 5, lightGreen, Math.PI * 1.04); // green

  shadeSlicesForLogo(svg, 200, 200, 140, 1, 7, 5, lightGreen, Math.PI * 0.8); // green

  shadeSlicesForLogo(svg, 200, 200, 200, 1, 7, 5, peach, Math.PI * 0.52); // peach
  shadeSlicesForLogo(svg, 200, 200, 130, 1, 9, 5, teal, Math.PI * 0.3); // teal

  shadeSlicesForLogo(svg, 200, 200, 160, 1, 7, 5, lightGreen, Math.PI * 0.06);
  shadeSlicesForLogo(svg, 200, 200, 200, 1, 10, 5, peach, Math.PI * -0.14);

  shadeSlicesForLogo(svg, 200, 200, 165, 1, 8, 5, lightGreen, Math.PI * -0.39);
  shadeSlicesForLogo(svg, 200, 200, 200, 1, 13, 5, orange, Math.PI * -0.55);
  const tealSlice2 = shadeSlicesForLogo(
    svg,
    200,
    200,
    170,
    1,
    16,
    5,
    teal,
    Math.PI * -0.675
  );
}

drawLogo(logosvg);
