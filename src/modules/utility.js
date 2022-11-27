const radConst = Math.PI / 180;
function toRad(degrees) {
    return degrees * radConst;
}

module.exports = { toRad };
