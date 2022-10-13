const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const RoleService = require('./role')
const { mongo: { queries } } = require('../database')
const { hash: { hashString } } = require('../utils')
const { user } = require('../schemas')
const {
  user: {
    getUserById,
    saveUser,
    getAllUsers,
    removeUserById,
    updateOneUser,
    getOneUser,
  }
} = queries

class UserService {
  #userId
  #name
  #lastName
  #email
  #password
  #role
  #balance

  /**
   * @param {Object} args
   * @param {String} args.userId
   * @param {String} args.name
   * @param {String} args.lastName
   * @param {String} args.email
   * @param {String} args.password
   * @param {String} args.role
   * @param {String} args.balance
   */
  constructor(args = {}) {
    const {
      userId = '',
      name = '',
      lastName = '',
      email = '',
      password = '',
      role = '',
      balance = '',
    } = args

    this.#userId = userId
    this.#name = name
    this.#lastName = lastName
    this.#email = email
    this.#password = password
    this.#role = role
    this.#balance = balance
  }

  async verifyUserExists() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getUserByID(this.#userId)

    if (!user) throw new httpErrors.NotFound('User not found')

    return user
  }

  async saveUser() {
    if (!this.#name)
      throw new httpErrors.BadRequest('Missing required field: name')

    if (!this.#lastName)
      throw new httpErrors.BadRequest('Missing required field: lastName')

    if (!this.#email)
      throw new httpErrors.BadRequest('Missing required field: email')

    if (!this.#password)
      throw new httpErrors.BadRequest('Missing required field: password')

    if (!this.#role)
      throw new httpErrors.BadRequest('Missing required field: role')

    const { salt, result: hash } = hashString(this.#password)
    const role = await new RoleService({ id: this.#role }).getRoleById()

    const user = await saveUser({
      id: nanoid(),
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email,
      salt,
      hash,
      role: role._id
    })

    return user
  }

  async getUserById() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getUserById(this.#userId)

    if (!user)
      throw new httpErrors.NotFound('The requested user does not exists')

    return user
  }

  async getAllUsers() {
    return await getAllUsers()
  }

  async removeUserById() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await removeUserById(this.#userId)

    if (!user)
      throw new httpErrors.NotFound('The requested user does not exists')

    return user
  }

  async updateOneUser() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const updatePassword = !!this.#password
    const aux = {}

    if (updatePassword) {
      const { salt, result: hash } = hashString(this.#password)

      aux.salt = salt
      aux.hash = hash
    }

    return await updateOneUser({
      id: this.#userId,
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email,
      ...aux
    })
  }

  async login() {
    if (!this.#email)
      throw new httpErrors.BadRequest('Missing required field: email')

    if (!this.#password)
      throw new httpErrors.BadRequest('Missing required field: password')

    if (!this.#role)
      throw new httpErrors.BadRequest('Missing required field: role')

    const role = await new RoleService({ id: this.#role }).getRoleById()

    const user = await getOneUser({ email: this.#email, role: role._id })
    
    if (!user) throw new httpErrors.BadRequest('Bad credentials')

    const { salt, hash } = user
    const { result } = hashString(this.#password, salt)

    if (hash !== result) throw new httpErrors.BadRequest('Bad credentials')

    return user
  }

  async addBalance() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    if (!this.#balance)
      throw new httpErrors.BadRequest('Missing required field: balance')

    const user = await getOneUser({ id: this.#userId })

    const newBalance = user.balance + this.#balance

    return await updateOneUser({
      id: this.#userId,
      balance: newBalance
    })
  }

  async subBalance() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    if (!this.#balance)
      throw new httpErrors.BadRequest('Missing required field: balance')

    const user = await getOneUser({ id: this.#userId })

    const newBalance = user.balance - this.#balance

    return await updateOneUser({
      id: this.#userId,
      balance: newBalance
    })
  }

  async getUserBy_id() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getOneUser({id_: this.#userId})

    if (!user)
      throw new httpErrors.NotFound('The requested user does not exists')

    return user
  }
}

module.exports = UserService