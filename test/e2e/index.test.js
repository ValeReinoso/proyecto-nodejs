const { server } = require('../../src/network')
const { faker } = require('@faker-js/faker')    
const axios = require('axios')

const URL = `http://localhost:${process.env.PORT || 2000}`


beforeAll(async () => {
    await server.start()
})

afterAll(async () => {
    await server.stop()
})

describe('API: GET /', () => {
    let response = {}
    
    test('Should return 200 as status code', async () => {
        response = await axios.get(URL)
        expect(response.status).toBe(200)
    })

    test('Should be a successful operation', async () => {
        expect(response.data.error).toBe(false)
    })

})

describe('E2E test: Use cases from E-Commerce', () => {        
    //DATOS SOBRE CLIENTE
    let name = faker.name.firstName()
    let lastName = faker.name.lastName() 

    const newClientUser = {
        name,
        lastName,
        email: faker.internet.email(name, lastName).toLowerCase(),
        password: faker.datatype.string(),
        role: '3'
    }

    const clientTokens = {
        accessToken: '',
        refreshToken: ''
    }

    //DATOS SOBRE VENDEDOR
    name = faker.name.firstName()
    lastName = faker.name.lastName() 

    const newSellerUser = {
        name,
        lastName,
        email: faker.internet.email(name, lastName).toLowerCase(),
        password: faker.datatype.string(),
        role: '2'
    }
    
    const sellerTokens = {
        accessToken: '',
        refreshToken: ''
    }

    //DATOS SOBRE ARTICULO
    const newArticle = {
        name: "Galaxi Tab S8",
        description: "Tablet de Alta Gama",
        price: 900000,
        image: "https://http2.mlstatic.com/D_NQ_NP_966886-MLA48427341404_122021-O.jpg"
    }

    describe('Testing Sign Up Cliente', () => {
        let response = {}
        
        test('Should return 201 as status code', async () => {
            response = await axios.post(`${URL}/api/user/signup`, newClientUser)
            const { data: { message } } = response
            
            expect(response.status).toBe(201) 
            newClientUser.id = message.id
        })  
       
    })
    
    describe('Testing Login Cliente', () => {
        const keys = ['accessToken', 'refreshToken']

        test('Should return accessToken and refreshToken', async () => {
            const {
                data: { message }
            } = await axios.post(`${URL}/api/user/login`, {
                email: newClientUser.email,
                password: newClientUser.password,
                role: '3'
            })

            expect(Object.keys(message)).toEqual(keys)
            clientTokens.accessToken = message.accessToken
            clientTokens.refreshToken = message.refreshToken
        })
    })

    describe('Testing Sign Up Seller', () => {
        test('Should return 201 as status code', async () => {
            response = await axios.post(`${URL}/api/user/signup`, newSellerUser)
            const { data: { message } } = response
            
            expect(response.status).toBe(201)
            newArticle.userId = message.id
            newSellerUser.id = message.id
        })
    })

    describe('Testing Login Seller', () => {
        const keys = ['accessToken', 'refreshToken']

        test('Should return accessToken and refreshToken', async () => {
            const { data: { message } } = await axios.post(`${URL}/api/user/login`, {
                email: newSellerUser.email,
                password: newSellerUser.password,
                role: '2'
            })

            expect(Object.keys(message)).toEqual(keys)
            sellerTokens.accessToken = message.accessToken
            sellerTokens.refreshToken = message.refreshToken
        })
    })
    
    describe('Testing save article', () => {
        let response = {}
        
        test('Should return 201 as status code', async () => {
            response = await axios.post(`${URL}/api/user/createArticle`, newArticle)
            const { data: { message } } = response

            expect(response.status).toBe(201)
            newArticle.id = message.id
        })  
    })
    
    describe('Testing try buy article', () => {
        test('El saldo del cliente del insuficiente', async () => {
            response = await axios.post(`${URL}/api/user/verifyBuyArticle`, {
                articleId: newArticle.id, 
                userId: newClientUser.id
            })
            
            const { data: { message } } = response 

            expect(message).toBe(false)
        
            const response2 = await axios.post(`${URL}/api/user/addBalance`, {
                 balance: 1000000, 
                 userId: newClientUser.id
            })

            newClientUser.balance = response2.data.message.balance
        }) 

        test('El saldo del cliente es suficiente', async () => {
            response = await axios.post(`${URL}/api/user/verifyBuyArticle`, {
                articleId: newArticle.id, 
                userId: newClientUser.id
            })

            const { data: { message} } = response

            expect(message).toBe(true)
        })  
        
    })

    describe('Testing El saldo pasa de la cuenta del cliente a la cuenta del vendedor', () => {
        test('Should return 201 as status code', async () => {
            response = await axios.post(`${URL}/api/user/subBalance`, {
                balance: newArticle.price, 
                userId: newClientUser.id
            })

            const { data: { message } } = response

            expect(message.balance).toBe(1000000 - newArticle.price)
            newClientUser.balance = message.balance
        })  
        
        test('Should return 201 as status code', async () => {
            response = await axios.post(`${URL}/api/user/addBalance`, {
                balance: newArticle.price, 
                userId: newSellerUser.id
            })

            const { data: { message } } = response

            expect(message.balance).toBe(newArticle.price)
            newSellerUser.balance = message.balance
        })  
    })

    describe('Testing El artículo pasa de la cuenta del vendedor a la cuenta del cliente', () => {
        test('Should return 201 as status code', async () => {
            response = await axios.post(`${URL}/api/user/addClientArticle`, {
                articleId: newArticle.id, 
                userId: newClientUser.id
            })

            expect(response.status).toBe(201)
        })  
    })
})

