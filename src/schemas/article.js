const { Type } = require('@sinclair/typebox')

const storeArticleSchema = Type.Object({
    name: Type.String({ 
        minLength: 2 
    }),
    description: Type.String({ 
        minLength: 2 
    }),
    price: Type.Number({ 
        minimum: 0
    })
})

const updateArticleSchema = Type.Object({
    name: Type.Optional(Type.String({ 
        minLength: 2 
    })),
    description: Type.Optional(Type.String({ 
        minLength: 2 
    })),
    price: Type.Optional(Type.Number({ 
        minimum: 0
    }))
})

const articleIdSchema  = Type.Object({
    id: Type.String({
        minLength: 21,
        maxLength: 21
    })
})

module.exports = {
    storeArticleSchema,
    updateArticleSchema,
    articleIdSchema
}