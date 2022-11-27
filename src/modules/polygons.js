const earcut = require('earcut');
const { toRad } = require('./utility');
const { lineColor } = require('../config');

function rotateAroundPoint(point, pivotPoint, degreesToRotate) {
    // Translate point to be relative to origin
    point.x -= pivotPoint.x;
    point.y -= pivotPoint.y;
    
    const radsToRotate = toRad(degreesToRotate);
    const sinOfDegrees = Math.sin(radsToRotate);
    const cosOfDegrees = Math.cos(radsToRotate);
    
    // Rotate point around origin by degreesToRotate
    const rotatedX = point.x * cosOfDegrees - point.y * sinOfDegrees;
    const rotatedY = point.x * sinOfDegrees + point.y * cosOfDegrees;
    
    // Reverse earlier translation
    point.x = rotatedX + pivotPoint.x;
    point.y = rotatedY + pivotPoint.y;
    
    return point;
}

function generateNGon(n, sideLength) {
    const points = [new BABYLON.Vector2(0, 0), new BABYLON.Vector2(sideLength, 0)];
    const interiorAngleDegrees = 180 - ((n - 2) * 180 / n);
    
    for (let i = 0; i < n - 2; i++) {
        const lastPoint = points[points.length - 1];
        const thisPoint = new BABYLON.Vector2(lastPoint.x + sideLength, lastPoint.y);
        points.push(rotateAroundPoint(thisPoint, lastPoint, ((i + 1) * interiorAngleDegrees)));
    }
    
    return points;
}

module.exports = scene => {
    var mat = new BABYLON.StandardMaterial("mat", scene);
    const black = BABYLON.Color3.FromHexString('#000000');

    for (colorType of ['diffuseColor', 'specularColor', 'emissiveColor', 'ambientColor']) {
        mat[colorType] = black;
    }
    
    return function generateNPrism(n, sideLength) {
        const corners = generateNGon(n, sideLength);
        const polygon = new BABYLON.PolygonMeshBuilder("polytri", corners, scene, earcut);
        const prism = polygon.build(false, 10);
        
        // https://doc.babylonjs.com/typedoc/classes/BABYLON.EdgesRenderer - 0.999 is the 'epsilon'
        prism.enableEdgesRendering(0.999);
        prism.edgesWidth = 30.0;
        prism.edgesColor = lineColor;
        prism.material = mat;
        
        return prism
    }
}
