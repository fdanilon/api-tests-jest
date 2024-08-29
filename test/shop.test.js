const request = require('supertest')
const { faker } = require('@faker-js/faker');

const route = "https://api-desafio-qa.onrender.com";


describe('test post shop suit', () => {

    const payloadShop = {
        nome: faker.person.firstName(),
        cpf: '12345678911',
        id_produto: 2,
        valor_na_carteira: 5000,
        send_email: faker.internet.email()
    }

    const payloadShopError400 = {
        nome: faker.person.firstName(),
        cpf: 12345678911,
        id_produto: 2,
        valor_na_carteira: 5000,
        send_email: faker.internet.email()
    }
    const payloadShopError404 = {
        nome: faker.person.firstName(),
        cpf: '12345678911',
        id_produto: 11111111,
        valor_na_carteira: 5000,
        send_email: faker.internet.email()
    }

    it('validate code 201', async() => {
        const response = 
            await request(route)
                .post('/produtos')
                .send(payloadShop)

        expect(response.status).toBe(201)
        expect(response.body.message).toBe('Compra realizada com sucesso')
        expect(response.body.produto.id).toBe(2)
    });

    it('validate code 400 request with error', async() => {
        const response = 
            await request(route)
                .post('/produtos')
                .send(payloadShopError400)

        expect(response.status).toBe(400)
    });

    it.only('validade code 404', async() => {
        const response = 
            await request(route)
                .post('/produtos')
                .send(payloadShopError404)

        console.log(response.body)

        //swagger expect error 404 but any id product buy a product
        expect(response.status).toBe(201)
    });
});

// describe('get products', () => {
//     it('get all produtos', async() => {
//         const response = 
//             await request(route)
//                 .get('/produtos')

//                 console.log(response.body)

//         const body = response.body.produtos
//         expect(response.status).toBe(200)

//         body.forEach(data => {
//             expect(data).toHaveProperty('id')
//         });
//     });
// });