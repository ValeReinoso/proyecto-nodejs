const { Router } = require('express')
const httpErrors = require('http-errors')

const { 
    user: { storeUserSchema, updateUserSchema, userIDSchema, userLoginSchema, chargeBalanceSchema },
    article: { storeArticleSchema }
} = require('../../schemas')
const { auth, validatorCompiler } = require('./utils')
const response = require('./response')
const { UserService, ArticleService } = require('../../services')

const UserRouter = Router()

UserRouter.route('/user').get(auth.verifyUser(), async (req, res, next) => {
  try {
    const userService = new UserService()

    response({
      error: false,
      message: await userService.getAllUsers(),
      res,
      status: 200
    })
  } catch (error) {
    next(error)
  }
})

UserRouter.route('/user/signup').post(
  validatorCompiler(storeUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        body: { name, lastName, email, password, role }
      } = req

      response({
        error: false,
        message: await new UserService({
          name,
          lastName,
          email,
          password, 
          role
        }).saveUser(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/login').post(
  validatorCompiler(userLoginSchema, 'body'),
  auth.generateTokens(),
  async (req, res, next) => {
    try {
      const {
        accessToken,
        refreshToken,
        body: { email, role, password }
      } = req
      const isLoginCorrect = await new UserService({ email, role, password }).login()

      if (isLoginCorrect)
        return response({
          error: false,
          message: {
            accessToken,
            refreshToken
          },
          res,
          status: 200
        })

      throw new httpErrors.Unauthorized('You are not registered')
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/:id')
  .get(
    validatorCompiler(userIDSchema, 'params'),
    auth.verifyIsCurrentUser(),
    async (req, res, next) => {
      try {
        const {
          params: { id: userId }
        } = req
        const userService = new UserService({ userId })

        response({
          error: false,
          message: await userService.getUserByID(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .delete(
    validatorCompiler(userIDSchema, 'params'),
    auth.verifyIsCurrentUser(),
    async (req, res, next) => {
      try {
        const {
          params: { id }
        } = req
        const userService = new UserService({ userId: id })

        response({
          error: false,
          message: await userService.removeUserByID(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .patch(
    validatorCompiler(userIDSchema, 'params'),
    validatorCompiler(updateUserSchema, 'body'),
    auth.verifyIsCurrentUser(),
    async (req, res, next) => {
      const {
        body: { name, lastName, email, password },
        params: { id: userId }
      } = req

      try {
        response({
          error: false,
          message: await new UserService({
            userId,
            name,
            lastName,
            email,
            password
          }).updateOneUser(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )

UserRouter.route('/user/refreshAccessToken/:id').get(
  validatorCompiler(userIDSchema, 'params'),
  auth.verifyIsCurrentUser(),
  auth.refreshAccessToken(),
  async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = req

      response({
        error: false,
        message: {
          accessToken,
          refreshToken
        },
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/createArticle/').post(
  validatorCompiler(storeArticleSchema, 'body'),
  //auth.verifyIsCurrentUser(),
  async (req, res, next) => {
    try {
      const {
        body: { name, description, price, image, userId }
      } = req

      response({
        error: false,
        message: await new ArticleService({
          name,
          description,
          price,
          image, 
          userId
        }).saveArticle(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/addBalance/').post(
  validatorCompiler(chargeBalanceSchema, 'body'),
  //auth.verifyIsCurrentUser(),
  async (req, res, next) => {
    try {
      const {
        body: { balance, userId }
      } = req

      response({
        error: false,
        message: await new UserService({
          balance,
          userId
        }).addBalance(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/subBalance/').post(
  validatorCompiler(chargeBalanceSchema, 'body'),
  //auth.verifyIsCurrentUser(),
  async (req, res, next) => {
    try {
      const {
        body: { balance, userId }
      } = req

      response({
        error: false,
        message: await new UserService({
          balance,
          userId
        }).subBalance(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/:userId/article/:articleId').patch(
  //validatorCompiler(chargeBalanceSchema, 'params'),
  //auth.verifyIsCurrentUser(),
  async (req, res, next) => {
    try {
      const {
        params: { articleId: articleId, userId: userId }
      } = req

      response({
        error: false,
        message: await new ArticleService({
          articleId,
          userId
        }).buyArticle(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = UserRouter