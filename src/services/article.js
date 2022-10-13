const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const UserService = require('./user')
const { mongo: { queries } } = require('../database')
const {
    article: { saveArticle, getOneArticle, updateOneArticle }
} = queries

class ArticleService {
  #articleId
  #name
  #description
  #price
  #image
  #userId

  /**
   * @param {Object} args
   * @param {String} args.articleId
   * @param {String} args.name
   * @param {String} args.description
   * @param {String} args.price
   * @param {String} args.image
   * @param {String} args.userId
   */
  constructor(args = {}) {
    const {
      articleId = '',
      name = '',
      description = '',
      price = '',
      image = '',
      userId = ''
    } = args

    this.#articleId = articleId
    this.#name = name
    this.#description = description
    this.#price = price
    this.#image = image
    this.#userId = userId
  }

  async saveArticle() {
    if (!this.#name)
      throw new httpErrors.BadRequest('Missing required field: name')

    if (!this.#description)
      throw new httpErrors.BadRequest('Missing required field: description')

    if (!this.#price)
      throw new httpErrors.BadRequest('Missing required field: price')

    if (!this.#image)
      throw new httpErrors.BadRequest('Missing required field: image')

    if(!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await new UserService({ userId: this.#userId }).getUserById()

    if(user.role === '2')
        throw new httpErrors.BadRequest('Required role "2"')

    const article = await saveArticle({
      id: nanoid(),
      name: this.#name,
      description: this.#description,
      price: this.#price,
      image: this.#image,
      userId: user._id
    })

    return article
  }

  async buyArticle() {
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')

    if(!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const article = await getOneArticle({ id: this.#articleId })

    const clientUser = await new UserService({ userId: this.#userId }).getUserById()
    const sellerUser = await new UserService({ userId: this.#userId }).getUserBy_id()

    const difClientBalance = clientUser.balance - article.price 
    
    if (difClientBalance < 0) 
      throw new httpErrors.BadRequest('You do not have enough balance')

    await new UserService({ userId: this.#userId, balance: article.price }).subBalance()
    
    await new UserService({ userId: sellerUser.id, balance: article.price }).addBalance()

    return await addClientArticle({
      id: article.id,
      userId: clientUser.id
    })
  }

  async verifyBuyArticle(){
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')

    if(!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const clientUser = await new UserService({ userId: this.#userId }).getUserById()
    const article = await getOneArticle({ id: this.#articleId })

    const difClientBalance = clientUser.balance - article.price 
    
    if (difClientBalance < 0) 
      return false

    return true
  }

  async addClientArticle() {
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')

    if(!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const clientUser = await new UserService({ userId: this.#userId }).getUserById()

    await updateOneArticle({
      id: this.#articleId,
      userId: clientUser._id
    })
  }
}

module.exports = ArticleService