const { toRad } = require('./utility');
const { polygonSideLength } = require('../config');
const frameRate = 10;

function animateCamera(camera, scene) {
    const cameraAnimation = new BABYLON.Animation('cameraAnimation', 'position.z', frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    cameraAnimation.setKeys([{
        frame: 0,
        value: camera.position.z
    }, {
        frame: frameRate,
        value: camera.position.z + polygonSideLength
    }]); 
    
    camera.animations = [cameraAnimation];
    
    scene.beginAnimation(camera, 0, frameRate, true);
}

function animatePrism(prism, scene) {
    scene.beginAnimation(prism, 0, frameRate, true);
}

function generateAnimationForPrism(n) {
    const interiorAngleDegrees = 180 - ((n - 2) * 180 / n);
    const rotateAnimation = new BABYLON.Animation(`prismAnimation${n}`, 'rotation.x', frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    rotateAnimation.setKeys([{
        frame: 0,
        value: toRad(270)
    }, {
        frame: frameRate,
        value: toRad(270 + interiorAngleDegrees)
    }]);
    
    return rotateAnimation;
}

module.exports = { animateCamera, animatePrism, generateAnimationForPrism };
