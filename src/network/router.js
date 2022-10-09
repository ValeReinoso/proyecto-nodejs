const httpErrors  = require('http-errors')

const { homeRouter, userRouter, articleRouter, roleRouter,  response } = require('./routes')
const routers = [ userRouter, articleRouter, roleRouter]

/**
 * @param { import('express').Express } app 
 */
const applyRoutes = app => {
    app.use('/', homeRouter)
    routers.forEach(router => app.use('/api', router))
    
    //Handling 404 error
    app.use((req, res, next) => {
        next(new httpErrors.NotFound('This route does not exists'))
    })

    // Middleware that handles errors
    app.use((error, req, res, next) => {
        response({
            message: error.message || 'Internal Server Error',
            res,
            status: error.status || 500
        })
        next()
    })
}
    
module.exports = applyRoutes

