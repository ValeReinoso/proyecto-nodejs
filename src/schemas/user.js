const { Type } = require('@sinclair/typebox')

const storeUserSchema  = Type.Object({
    name: Type.String({ 
        minLength: 2 
    }),
    lastName: Type.String({ 
        minLength: 2 
    }),
    email: Type.String({ 
        format: 'email'
    }),
    password: Type.String({ 
        minLength: 8 
    }),
    balance: Type.Number({ 
        default: 0
    })
})

const updateUserSchema = Type.Partial(storeUserSchema)

const userIdSchema  = Type.Object({
    id: Type.String({
        minLength: 21,
        maxLength: 21
    })
})

const userLoginSchema = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ 
        minLength: 8 
    })
  })

const chargeBalanceSchema = Type.Object({
    balance: Type.Number({ 
        default: 0,
 
    }),
    userId: Type.String({
        minLength: 21,
        maxLength: 21
    })
  })

const addClientArticleSchema  = Type.Object({
    id:Type.String({
        minLength: 21,
        maxLength: 21
    }),
    userId: Type.String({
        minLength: 21,
        maxLength: 21
    })
  })

module.exports = {
    storeUserSchema,
    updateUserSchema,
    userIdSchema,
    userLoginSchema,
    chargeBalanceSchema,
    addClientArticleSchema
}