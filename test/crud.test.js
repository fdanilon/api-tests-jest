const request = require('supertest')
const { faker } = require('@faker-js/faker');

const route = "https://api-desafio-qa.onrender.com";

describe('test crud', () => {

    let id = 0
    const randomName = faker.person.firstName()
    const randomEmail = faker.internet.email()
    const idade = 19
    const randomTelephone = faker.phone.number()
    const randomAddress = faker.location.streetAddress()
    const randomJob = faker.person.jobTitle()
    const randomCompany = faker.company.name()

    const payload = {
        nome: randomName,
        email: randomEmail,
        idade: idade,
        telefone: randomTelephone,
        endereco: randomAddress,
        profissao: randomJob,
        empresa: randomCompany
    }


    it('get crud', async() => {
        const response =
            await request(route)
                .get('/crud')

        console.log(response.body)

        expect(response.status).toBe(200)
        
        const body = response.body

        body.forEach(data => {
            expect(data.idade).toBeGreaterThan(0)
            expect(data.email).toMatch(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            expect(data.dataCadastro).toMatch(new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/))
        });

    });

    it.only('post crud', async() => {
        const response =
            await request(route)
                .post('/crud')
                .send(payload)  

        id = response.body.id
        expect(response.statusCode).toBe(201)
        expect(response.body.nome).toBe(randomName)
        expect(response.body.email).toBe(randomEmail)
        expect(response.body.idade).toBe(idade)
        expect(response.body.telefone).toBe(randomTelephone)
        expect(response.body.endereco).toBe(randomAddress)
        expect(response.body.empresa).toBe(randomCompany)
        expect(response.body.status).toBe('ativo')
        expect(response.body.dataCadastro).toMatch(new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/))
    });

    it.only('get register test above', async() => {
        const response =
            await request(route)
                .get(`/crud/${id}`)

        expect(response.status).toBe(200)

        expect(response.body.idade).toBeGreaterThan(0)
        expect(response.body.email).toMatch(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        expect(response.body.dataCadastro).toMatch(new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/))
    });
    
});