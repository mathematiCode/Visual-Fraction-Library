<h1>Math Clip Art Library</h1>

This is the beginning of a library of simple math visualization functions built on top of html canvas.
I am considering converting the functions or at least building new functions to create svgs instead of canvases. 

My goal is to have a website and a javascript library with many different types of math visuals.

<h2> Math Visual Functions/Pages to Create </h2>
<ul>
- Fraction Bar ✅
- Fraction Circle ✅
- Improper Fraction Representations (circles only right now) ✅
- Fraction Division Bar when dividend > divisor ✅
- Fraction Division with Circles [in progress]
- Fraction Multiplication
- Fraction on a Number Line
- Decimal on a Number Line
- Negative Numbers on a Number Line
- Base 10 blocks
- Customizable triangles, trapezoids, parallelograms, etc. with optionally labeled side lengths
- Customizable 3D shapes
- Linear Graphs
- Non Linear Graphs
- Scatter Plots
- Box Plots
- Histograms
- Percent Bar Graphs
- Circle Graphs
- Dot Plots
- Maybe More?
</ul>

<h2> Customization Options and Features </h2>
- Change color
- Change line width
- Copy to Clipboard
- Ability to drag and drop multiple items or add labels or other things to them?
- Change size of image ??
- Download as png or jpg??
- Download as svg?

<h2> Things that I need to figure out </h2>
<ul>
<li>Should the fraction bar and circle be two toggles on the same page or two separate pages? </li> 
<li> Would it be better to have the function create the canvas or have the canvas fed into the function as a parameter? 
 I think for layout it's better for the canvas to be standard. BUT... if I make the fraction bar and fraction circle all on one page, I may need to change the functions so they both look good in the same size canvas. </li>
<li> How can I make the library testable? </li>
</ul>
