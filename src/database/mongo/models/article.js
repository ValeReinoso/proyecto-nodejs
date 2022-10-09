const { model, Schema } = require('mongoose')

const articleSchema = new Schema(
    {
        id: {
            required: true, 
            type: String,
            unique: true
        },
        name: {
            required: true, 
            type: String
        },
        description: {
            required: true, 
            type: String
        },
        price: {
            required: true, 
            type: Number
        },
        image: {
            required: true, 
            type: String
        },
        userId: {
            require: true, 
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toObject: {
            transform: (_,ret) => {
                delete ret._id
            }
        }
    }
)

const ArticleModel = model('articles', articleSchema)

module.exports = ArticleModel