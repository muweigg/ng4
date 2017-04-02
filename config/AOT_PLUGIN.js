const { AotPlugin } = require('@ngtools/webpack');
const helpers = require('./helpers');
const AOT = helpers.hasNpmFlag('aot');

var aotPlugin = new AotPlugin({
    tsConfigPath: './tsconfig.json',
    mainPath: './src/main.ts',
    skipCodeGeneration: !AOT
});

aotPlugin._compilerHost._resolve = function(path_to_resolve) {
    path_1 = require("path");
    path_to_resolve = aotPlugin._compilerHost._normalizePath(path_to_resolve);
    if (path_to_resolve[0] == '.') {
        return aotPlugin._compilerHost._normalizePath(path_1.join(aotPlugin._compilerHost.getCurrentDirectory(), path_to_resolve));
    }
    else if (path_to_resolve[0] == '/' || path_to_resolve.match(/^\w:\//)) {
        return path_to_resolve;
    }
    else {
        return aotPlugin._compilerHost._normalizePath(path_1.join(aotPlugin._compilerHost._basePath, path_to_resolve));
    }
};

module.exports = aotPlugin;
