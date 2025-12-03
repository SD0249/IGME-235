// PIXI Initialization
const WIDTH = 600;
const HEIGHT = 600;
let visuals = null;

async function start() {
        // 1. Declare Pixi Application and Initialize the application asynchronously
        const app = new PIXI.Application();

        await app.init({
                width: WIDTH,
                height: HEIGHT,
                backgroundColor: 0xf8f8f8
        });

        document.querySelector('.grid').appendChild(app.canvas);

        // 2. Center the Origin
        // PIXI's (0,0) to center of the screen, and Y to point up!
        app.stage.position.set(WIDTH / 2, HEIGHT / 2);
        app.stage.scale.y = -1;

        // 3. Create a PIXI.Graphics object to draw everything
        visuals = new PIXI.Graphics();
        app.stage.addChild(visuals);

        // OPTIONAL: If zooming in makes the tool more useful for users, then do so

        DisplayGrid();

        drawVisualization();
}


// Function to draw grid lines
function DisplayGrid() {

        // Clear the previous transformation/drawing
        // -> OPTIONAL: This might be changed if visual tracing (stretch features) are implemented
        visuals.clear();

        // Draw Grid Lines
        visuals.lineStyle(1, 0xCCCCCC, 1);
        for (let i = -300; i <= 300; i += 30) {
                // Draw vertical lines
                visuals.moveTo(i, -300);
                visuals.lineTo(i, 300);

                // Draw horizontal lines
                visuals.moveTo(-300, i);
                visuals.lineTo(300, i);
        }

        // Draw Main Axes
        visuals.lineStyle(2, 0x000000, 1);
        visuals.moveTo(-300, 0); visuals.lineTo(300, 0); // X-axis
        visuals.moveTo(0, -300); visuals.lineTo(0, 300); // Y-axis
}

// Draw visuals, shape and its transformation
function drawVisualization() {
        // Define the shape vertices
        // TEST -> House (TODO: Add more shapes, maybe use enum)
        const houseVertices = [
                new Vector2D(-2, 0),
                new Vector2D(2, 0),
                new Vector2D(2, 3),
                new Vector2D(0, 5),
                new Vector2D(-2, 3)
        ];

        // TEST -> data is NOT given from here
        const M_total = new Matrix3x3([2, 1.5, 0, 0, 1, 0, 0, 0, 1]);

        visuals.lineStyle(3, 0x00AA00, 1); // Green for the transformed shape
        visuals.beginFill(0x00AA00, 0.1); // Light fill

        let firstTransformed = M_total.multiplyVector(houseVertices[0]);
        visuals.moveTo(firstTransformed.x * 30, firstTransformed.y * 30);

        for (let i = 1; i < houseVertices.length; i++) {
                let transformed = M_total.multiplyVector(houseVertices[i]);
                visuals.lineTo(transformed.x * 30, transformed.y * 30);
        }
        visuals.lineTo(firstTransformed.x * 30, firstTransformed.y * 30); // Close the shape
        visuals.endFill();
}

start();


