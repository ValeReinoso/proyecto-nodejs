module.exports = () => {
    if (process.env.NODE_ENV.includes('local')) require('./setEnvVars.js')
}