const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const { toRad } = require('./modules/utility');
const { animateCamera, animatePrism, generateAnimationForPrism } = require('./modules/animate');
const { polygonSideLength, prismSpacing, prismcount, groundTileLength, lineColor } = require('./config');

function generateTemplateStrip(scene) {
    const options = {
        points: [],
        colors: Array(groundTileLength * 5).fill(lineColor)
    }
    
    // Drawing squares, extending by polygonSideLength on the Z per groundTileLength
    for (let i = 0; i < groundTileLength; i++) {
        const basePosition = polygonSideLength * i;
        const extendedPosition = basePosition + polygonSideLength;
        options.points.push(
            new BABYLON.Vector3(0, 0, basePosition),
            new BABYLON.Vector3(polygonSideLength, 0, basePosition),
            new BABYLON.Vector3(polygonSideLength, 0, extendedPosition),
            new BABYLON.Vector3(0, 0, extendedPosition),
            new BABYLON.Vector3(0, 0, basePosition)
        );
    }
    
    return BABYLON.MeshBuilder.CreateLines('groundStripTemplate', options, scene);
}

function generateGroundStrips(scene) {
    const templateStrip = generateTemplateStrip(scene);
    for (let i = 0; i < prismcount - 1; i++) {
        const newStrip = templateStrip.clone(`groundStrip${i}`);
        newStrip.position.x += (i + 1) * prismSpacing;
    }
}

const createScene = () => {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    
    // Set background color to black
    scene.clearColor = BABYLON.Color3.FromHexString('#000000');
    
    // Creates and positions a free camera
    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(-80, 80, 80), scene);
    
    // Targets the camera
    camera.setTarget(new BABYLON.Vector3(0, 40, 40));
    
    // Attach the camera to the canvas
    camera.attachControl(canvas, true);
    
    generateGroundStrips(scene);
    
    const generateNPrism = require('./modules/polygons')(scene);
    const prismList = [];
    for (let i = 2; i < prismcount + 2; i++) {
        const prism = generateNPrism(i, polygonSideLength);
        prismList.push(prism);
        // Set inital prism position/rotation, add animation
        prism.position.x += (i - 2) * prismSpacing;
        prism.rotation.z = toRad(90);
        prism.animations.push(generateAnimationForPrism(i));
    }
    
    // Start animations
    prismList.forEach(prism => animatePrism(prism, scene));
    animateCamera(camera, scene);
    
    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});
