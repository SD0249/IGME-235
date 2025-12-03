// PIXI Initialization
const WIDTH = 600;
const HEIGHT = 600;

// 1. Create Pixi Application
const app = new PIXI.Application({
        width: WIDTH, 
        height: HEIGHT, 
        backgroundColor: 0xf8f8f8
});

document.getElementById('grid').appendChild(app.view);

// 2. Center the Origin
// PIXI's (0,0) to center of the screen, and Y to point up!
app.stage.position.set(WIDTH/2, HEIGHT/2);
app.stage.scale.y = -1;

// 3. Create a PIXI.Graphics object to draw everything
const visuals = new PIXI.Graphics();
app.stage.addChild(visuals);

// Define the shape vertices

// Function to draw grid lines, shapes and vectors