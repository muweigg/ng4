const helpers = require('./helpers');
const SpritesmithPlugin = require('webpack-spritesmith');

function getConfig (name) {
    return new SpritesmithPlugin({
        src: {
            cwd: helpers.root(`src/sprites/${name}`),
            glob: '**/*.png'
        },
        target: {
            image: helpers.root(`src/assets/${name}.png`),
            css: helpers.root(`src/scss/${name}.scss`)
        },
        apiOptions: {
            cssImageRef: `./assets/${name}.png`
        },
        spritesmithOptions: {
            padding: 10,
            algorithm: 'top-down',
            algorithmOpts: { sort: true },
            exportOpts: { quality: 75 }
        }
    })
}

module.exports = [
    getConfig('icons')
]

