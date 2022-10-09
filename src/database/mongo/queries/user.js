const UserModel = require("../models/user")

/**
 * @param { Object } user
 * @param { String } user.id
 * @param { String } user.name
 * @param { String } user.lastName
 * @param { String } user.email
 * @param { String } user.salt
 * @param { String } user.hash
 * @param { import('mongoose').Schema.Types.ObjectId } user.role
 * @returns A promise that resolves to the saved user
 */
const saveUser = async user => {
    const savedUser = new UserModel(user)

    await savedUser.save()

    return savedUser
}

/**
 * @param {String} id
 * @returns found user
 */
 const getUserById = async id => {
    const users = await UserModel.find({ id })
  
    return users[0]
}

/**
 * @returns found All User
 */
 const getAllUsers = async () => {
    const users = await UserModel.find()

    return users
}

/**
 * @param { String } id
 * @returns Remove User
 */
const removeUserById = async id => {
    const user = await UserModel.findOneAndRemove({ id })

    return user
}

/**
 * @param { Object } user
 * @param { String } user.id
 * @param { String | undefined } user.name
 * @param { String | undefined } user.lastName
 * @param { String | undefined } user.email
 * @param { String | undefined } user.salt
 * @param { String | undefined } user.hash
 * @param { Number | undefined } user.balance
 * @returns Update User
 */
 const updateOneUser = async user => {
    const { id, name, lastName, email, salt, hash, balance } = user 
    userUpdated = await UserModel.findOneAndUpdate( 
        { id }, 
        {
            ...(name && { name }),
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(salt && 
                hash && { salt, hash }),
            ...(balance && { balance })
        },
        { new: true } 
    )
    console.log(userUpdated)

    return userUpdated
}

/**
 * It returns the first user in the database that matches the query
 * @param {Object} query - The query object that will be used to find the user.
 * @returns The first user in the database
 */
 const getOneUser = async (query = {}) => {
    const users = await UserModel.find(query)
  
    return users[0]
}

module.exports = {
    saveUser,
    getUserById,
    getAllUsers,
    removeUserById,
    updateOneUser,
    getOneUser
}