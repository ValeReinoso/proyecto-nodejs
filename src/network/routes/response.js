/**
 * @param { Object } args
 * @param { Boolean } args.error
 * @param { Object } args.message
 * @param { Number } args.status
 * @param { import('express'.Response) } args.res
 */
const response = ({ error, message, status, res }) => {
    res.status(status).send({ error, message })
}

module.exports = response