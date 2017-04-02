module.exports = {
    port: 3001,
    host: '0.0.0.0',
    historyApiFallback: true,
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
}
