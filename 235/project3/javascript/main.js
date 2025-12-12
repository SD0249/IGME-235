// PIXI Initialization
const WIDTH = 600;
const HEIGHT = 600;

let app;
let gridGraphics;
let shapeGraphics;
let lineTracingGraphics;
let axesGraphics;
const gridSpacing = 30;

// Undo and Redo Stack
let backwardStack = new Stack();
let forwardStack = new Stack();

// Variables needed for Undo & Redo features
let previousTotalMatrix = new Matrix3x3();
let currentTotalMatrix = new Matrix3x3();

// Shape options for User to display
const shapeOptions = {
        House: [
                new Vector2D(0 * gridSpacing, 0 * gridSpacing),
                new Vector2D(3 * gridSpacing, 0 * gridSpacing),
                new Vector2D(3 * gridSpacing, 2 * gridSpacing),
                new Vector2D(1.5 * gridSpacing, 3.5 * gridSpacing),
                new Vector2D(0 * gridSpacing, 2 * gridSpacing)
        ],
        Square: [
                new Vector2D(0 * gridSpacing, 0 * gridSpacing),
                new Vector2D(2 * gridSpacing, 0 * gridSpacing),
                new Vector2D(2 * gridSpacing, 2 * gridSpacing),
                new Vector2D(0 * gridSpacing, 2 * gridSpacing)
        ],
        Heart: [
                new Vector2D(2 * gridSpacing, 0 * gridSpacing),
                new Vector2D(0 * gridSpacing, 3 * gridSpacing),
                new Vector2D(1 * gridSpacing, 4 * gridSpacing),
                new Vector2D(2 * gridSpacing, 3 * gridSpacing),
                new Vector2D(3 * gridSpacing, 4 * gridSpacing),
                new Vector2D(4 * gridSpacing, 3 * gridSpacing)
        ] 
}
 // Choice starts as House(DEFAULT), but user can use a drop down menu to change this
let shapeChoice = shapeOptions.House; 

// Set Up PIXI, and Draw the Grid and the Starting Shape
async function start() {
        // 1. Declare Pixi Application and Initialize the application asynchronously
        app = new PIXI.Application();

        await app.init({
                width: WIDTH,
                height: HEIGHT,
                backgroundColor: 0xf8f8f8
        });

        document.querySelector('.grid').appendChild(app.canvas);

        // 2. Create PIXI.Graphics objects to draw things
        gridGraphics = new PIXI.Graphics();
        shapeGraphics = new PIXI.Graphics();
        lineTracingGraphics = new PIXI.Graphics();

        app.stage.addChild(gridGraphics);
        app.stage.addChild(shapeGraphics);
        app.stage.addChild(lineTracingGraphics);

        // 3. Center the Origin (ORDER OF TRANSFORM MATTERS)
        // PIXI's (0,0) to center of the screen, and Y to point up!
        app.stage.position.set(WIDTH / 2, HEIGHT / 2);
        app.stage.scale.y = -1;

        // OPTIONAL: If zooming in makes the tool more useful for users, then do so

        DisplayGrid();
        DrawVisualization();
}


// Function to draw grid lines 
// (Line drawing here does not work for some reason, 
//  so it had to be done this way..)
function DisplayGrid() {
        // Clear the previous record
        // -> OPTIONAL: This might be changed if visual tracing (stretch features) are implemented
        gridGraphics.clear();

        const gridColor = 0xCCCCCC;
        const axisColor = 0x000000;

        // Draw grid lines as thin filled rectangles
        for (let i = -300; i <= 300; i += gridSpacing) {
                // Vertical grid line
                gridGraphics.beginFill(gridColor);
                gridGraphics.drawRect(i, -300, 1, 600); // x, y, width, height
                gridGraphics.endFill();

                // Horizontal grid line
                gridGraphics.beginFill(gridColor);
                gridGraphics.drawRect(-300, i, 600, 1); // x, y, width, height
                gridGraphics.endFill();
        }

        // Draw main axes as thicker rectangles
        axesGraphics = new PIXI.Graphics();
        app.stage.addChild(axesGraphics);
        const axisWidth = 3;
        const axisLength = 598;

        // X-axis
        axesGraphics.beginFill(axisColor);
        axesGraphics.drawRect(-299, -3, axisLength, axisWidth);
        axesGraphics.endFill();

        // Y-axis
        axesGraphics.beginFill(axisColor);
        axesGraphics.drawRect(-3, -299, axisWidth, axisLength);
        axesGraphics.endFill();
}

// Draw Chosen Shape on Grid with transformations
function DrawVisualization() {
        // Clear previous drawing (will be adjusted if line tracing feature will be added)
        shapeGraphics.clear();

        // Check for updates on user chosen shape
        ReadShapeChoice();

        // Define the shape vertices from the shape chosen from drop down menu
        const shapeVertices = shapeChoice;

        shapeGraphics.lineStyle(3, 0x00AA00, 1); // Green for the transformed shape
        shapeGraphics.beginFill(0x00AA00, 0.1); // Light fill

        let firstTransformed = currentTotalMatrix.multiplyVector(shapeVertices[0]);
        shapeGraphics.moveTo(firstTransformed.x, firstTransformed.y);

        for (let i = 1; i < shapeVertices.length; i++) {
                let transformed = currentTotalMatrix.multiplyVector(shapeVertices[i]);
                shapeGraphics.lineTo(transformed.x, transformed.y);
        }
        shapeGraphics.lineTo(firstTransformed.x, firstTransformed.y); // Close the shape
        shapeGraphics.endFill();

        // Line Tracing
        LineTracing(shapeVertices);
}

// Draw the chosen shape on Grid with transformations 
// right up to the previous one (Draw Visualization but one that uses previous matrix)
function LineTracing(shapeVertices) {
        // Assume that this function is called inside the DrawVisualization function - 
        // shapeGraphics.clear();
        // ReadShapeChoice();
        // const shapeVertices = shapeChoice;

        lineTracingGraphics.clear();

        if(backwardStack.isEmpty()) return;

        lineTracingGraphics.lineStyle(2, 0xFFA500, 0.5);
        lineTracingGraphics.beginFill(0xFFA500, 0.1);

        let firstTransformed = previousTotalMatrix.multiplyVector(shapeVertices[0]);
        lineTracingGraphics.moveTo(firstTransformed.x, firstTransformed.y);

        for(let i = 1; i < shapeVertices.length; i++) {
                let transformed = previousTotalMatrix.multiplyVector(shapeVertices[i]);
                lineTracingGraphics.lineTo(transformed.x, transformed.y);
        }
        lineTracingGraphics.lineTo(firstTransformed.x, firstTransformed.y);
        lineTracingGraphics.endFill();
}

// Retrieve the user chosen shape choice from the 
function ReadShapeChoice() {
        const shape = document.querySelector("#shapeChoice");
        if(shape.value === "house") {
                shapeChoice = shapeOptions.House;
        }
        else if(shape.value === "square") {
                shapeChoice = shapeOptions.Square;
        }
        else if(shape.value === "heart") {
                shapeChoice = shapeOptions.Heart;
        }
}

// Set up the basic of the tool -> Draw Grid / Initial Basic shape
start();


