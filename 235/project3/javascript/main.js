// PIXI Initialization
const WIDTH = 600;
const HEIGHT = 600;
let gridGraphics;
let shapeGraphics;
let axesGraphics;
let M_total = new Matrix3x3();;
const gridSpacing = 30;

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

        app.stage.addChild(gridGraphics);
        app.stage.addChild(shapeGraphics);

        // 3. Center the Origin (ORDER OF TRANSFORM MATTERS)
        // PIXI's (0,0) to center of the screen, and Y to point up!
        app.stage.position.set(WIDTH / 2, HEIGHT / 2);
        app.stage.scale.y = -1;

        // OPTIONAL: If zooming in makes the tool more useful for users, then do so

        DisplayGrid();
        DrawVisualization();

        console.log("gridGraphics in stage?", app.stage.children.includes(gridGraphics));
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

// Draw visuals, shape and its transformation
function DrawVisualization() {
        // Clear previous drawing (will be adjusted if line tracing feature will be added)
        shapeGraphics.clear();

        // Define the shape vertices
        // TEST -> House (TODO: Add more shapes, maybe use enum)
        const houseVertices = [
                new Vector2D(0 * gridSpacing, 0 * gridSpacing),
                new Vector2D(3 * gridSpacing, 0 * gridSpacing),
                new Vector2D(3 * gridSpacing, 2 * gridSpacing),
                new Vector2D(1.5 * gridSpacing, 3.5 * gridSpacing),
                new Vector2D(0 * gridSpacing, 2 * gridSpacing)
        ];

        // TEST -> data is NOT given from here
        // M_total = new Matrix3x3([1, 0, 0, 0, 1, 0, 0, 0, 1]);

        shapeGraphics.lineStyle(3, 0x00AA00, 1); // Green for the transformed shape
        shapeGraphics.beginFill(0x00AA00, 0.1); // Light fill

        let firstTransformed = M_total.multiplyVector(houseVertices[0]);
        shapeGraphics.moveTo(firstTransformed.x, firstTransformed.y);

        for (let i = 1; i < houseVertices.length; i++) {
                let transformed = M_total.multiplyVector(houseVertices[i]);
                shapeGraphics.lineTo(transformed.x, transformed.y);
        }
        shapeGraphics.lineTo(firstTransformed.x, firstTransformed.y); // Close the shape
        shapeGraphics.endFill();
}

start();


