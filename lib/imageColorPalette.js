const Vibrant = require('node-vibrant');
const fs = require('fs');

function getImageColorPalette(imageUrl) {
    const imageBuffer = fs.readFileSync(imageUrl);
    let v = new Vibrant(imageBuffer)
    return v.getPalette().then((palette) => {
        return palette;
    });
}

module.exports = getImageColorPalette;