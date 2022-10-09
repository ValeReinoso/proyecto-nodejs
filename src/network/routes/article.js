const { Router } = require('express')
const { nanoid } = require('nanoid')

const { article: { articleSchema, articleIdSchema, updateArticleSchema } } = require('../../schemas')
const { validatorCompiler } = require('./utils')
const { mongo: { queries } } = require('../../database')
const response = require('./response')

const ArticleRouter = Router()

const { 
    article: { 
        getAllArticles, 
        saveArticle, 
        removeOneArticle, 
        updateOneArticle,
        getOneArticle
    } 
} = queries


ArticleRouter.route('/article')
    .get( 
        async (req, res, next) => {
            try{
                const article = await getAllArticles()

                response({ error: false, message: article, res, status: 201 })
            } catch (error) {
                next(error)
            }
        }
    )
    .post( 
        validatorCompiler(articleSchema, 'body'),
        async (req, res, next) => {
            try {
                const { body: { name, description, price, image } } = req

                await saveArticle({
                    id: nanoid(),
                    name,
                    description,
                    price,
                    image
                })
                response({ error: false, message: await getAllArticles(), res, status: 201 })
            } catch (error) {
                next(error)
            }
        }
    )

ArticleRouter.route('/article/:id')
    .get( 
        validatorCompiler(articleIdSchema, 'params'),
        async (req, res, next) => {
            try {
                const { params: { id } } = req
                const article = await getOneArticle(id)

                response({ error: false, message: article, res, status: 200 })
            } catch (error){
                next(error)
            }
        }
    )
    .delete( 
        validatorCompiler(articleIdSchema, 'params'),
        async (req, res, next) => {
            try {
                const { params: { id } } = req
                
                await removeOneArticle(id)
                response({ error: false, message: await getAllArticles(), res, status: 200 })
            } catch (error){
                next(error)
            }
        }
    )
    .patch( 
        validatorCompiler(updateArticleSchema, 'body'),
        validatorCompiler(articleIdSchema, 'params'),
        async (req, res, next) => {
            const {
                    body: { name, description, price, image }, 
                    params: { id } 
            } = req

            try {
                await updateOneUser({ id, name, description, price, image })
                response({ error: false, message: await getAllArticles(), res, status: 200 })
            } catch (error){
                next(error)
            }
        }
    )

module.exports = ArticleRouter
