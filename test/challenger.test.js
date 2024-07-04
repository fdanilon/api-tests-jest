const request = require('supertest')

const route = "https://api-desafio-qa.onrender.com";


describe('test suit login', () => {

    const json_existing_user = {
        username: "admin",
        password: "password"
    }

    const json_not_existing_user = {
        username: "123",
        password: "123"
    }



    it('Login success', async() => {
        const response =
            await request(route)
                .post('/login')
                .send(json_existing_user);

        expect(response.status).toBe(201);       
    })

    it('Login invalid', async() => {
        const response =
            await request(route)
                .post('/login')
                .send(json_not_existing_user);

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Credenciais inválidas')     
    })

});

describe('Test suit /json_1', () => {

    it('product validations', async() => {
        let response =
            await request(route)
                .get('/json_1');        

        let hasDuplicatedOrVoid = false
        let foundIds = []
        let listId = response.body.produtos

        for (let i = 0; i < listId.length; i++) {
            const id = listId[i].id;
            const disponibility = listId[i].disponivel
            const price = listId[i].preco
            
            
            if (id === "" || id === null || id === undefined) {
                hasDuplicatedOrVoid = true;        
            }
            if (foundIds.includes(id)) {
                hasDuplicatedOrVoid = true;
            } 
            
            expect(typeof disponibility).toBe('boolean')
            expect(price).toBeGreaterThan(0)
            foundIds.push(id);
        }
        
        expect(hasDuplicatedOrVoid).toBe(false)        
    })

    it('user validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        expect(response.body.usuario.nome).not.toBeNull()
        expect(response.body.usuario.idade).toBeGreaterThan(0)
        expect(response.body.usuario.email).toMatch(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    })

    it('settings validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        expect(typeof response.body.configuracoes.notificacoes).toBe('boolean')
        expect(typeof response.body.configuracoes.tema).toBe('string')
        expect(response.body.configuracoes.tema).toBeDefined()
        expect(typeof response.body.configuracoes.idioma).toBe('string')
        expect(response.body.configuracoes.idioma).toBeDefined()        
    })

    it('address validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        expect(typeof response.body.endereco.rua).toBe('string')
        expect(response.body.endereco.rua).toBeDefined()
        expect(response.body.endereco.numero).toBeGreaterThan(-1)
        expect(typeof response.body.endereco.cidade).toBe('string')
        expect(response.body.endereco.cidade).toBeDefined()
        expect(response.body.endereco.estado).toMatch(new RegExp(/^[A-Z]{2}$/))
        expect(response.body.endereco.cep).toMatch(new RegExp(/^\d{5}-\d{3}$/))
    })

    it('historic order validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

                let hasProductInTheList = false
                let hasDuplicatedOrVoid = false
                let foundIds = []
                let orderList = response.body.historicoDePedidos 

                let productList = response.body.produtos
                
                

                for(let i = 0; i < orderList.length; i++){
                    const id = orderList[i].pedidoId;
                    const quantity = orderList[i].quantidade;
                    const totalPrice = orderList[i].precoTotal
                    if (foundIds.includes(id)) {
                        hasDuplicatedOrVoid = true;
                    } 
                    foundIds.push(id);

                    for (let j = 0; j < productList.length; j++) {
                        const nameOrderList = orderList[i].produto;
                        const nameProductList = productList[j].nome 

                        if(nameOrderList == nameProductList){
                            hasProductInTheList = true
                        } 

                    }       
                    expect(hasProductInTheList).toBe(true)
                    expect(quantity).toBeGreaterThan(0)
                    expect(totalPrice).toBeGreaterThan(0)
                }
                expect(hasDuplicatedOrVoid).toBe(false) 
    })

    it('actual cart validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

                let hasProductInTheList = false
                let actualCartList = response.body.carrinhoAtual.produtos
                let productList = response.body.produtos

                for(let i = 0; i < actualCartList.length; i++){
                    const quantity = actualCartList[i].quantidade
                    const totalPrice = response.body.carrinhoAtual.precoTotal
                    for (let j = 0; j < productList.length; j++) {
                        const idActualCartList = actualCartList[i].produtoId;
                        const idProductList = productList[j].id 

                        if(idActualCartList == idProductList){
                            hasProductInTheList = true
                        } 

                    }       
                    expect(hasProductInTheList).toBe(true)
                    expect(quantity).toBeGreaterThan(0)
                    expect(totalPrice).toBeGreaterThan(0)
                }

    })

    it('payment method validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        let paymentMethod = response.body.metodoDePagamento

        expect(paymentMethod.cartao.numero).toMatch(new RegExp(/\d{4} \d{4} \d{4} \d{4}/))
        expect(paymentMethod.cartao.validade).toMatch(new RegExp(/^(0[1-9]|1[0-2])\/\d{4}$/))
        expect(paymentMethod.cartao.cvv).toMatch(new RegExp(/^\d{3,4}$/))
    })

    it('contact validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        const emailSecundario = response.body.contato.emailSecundario
                
        if(emailSecundario != null){
            expect(emailSecundario).toMatch(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        }

        expect(response.body.contato.telefone).toMatch(new RegExp(/\(?([0-9]{2})\)?([ .-]?)([0-9]{5})([ .-]?)([0-9]{4})/))        
    })

    it('last shop validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        let hasProductInTheList = false
        let productList = response.body.produtos
        let productLastShop = response.body.ultimaCompra.produto
        for (let j = 0; j < productList.length; j++) {
            const productNameList = productList[j].nome;

            if(productNameList == productLastShop){
                hasProductInTheList = true
            } 
        }       
      
        expect(response.body.ultimaCompra.data).toMatch(new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/))
        expect(response.body.ultimaCompra.valor).toBeGreaterThan(0)
        expect(hasProductInTheList).toBe(true)

    })

    it('recomendations validations', async()=> {
        let response =
            await request(route)
                .get('/json_1');

        const recomendationList = response.body.recomendacoes

        for(let i = 0; i < recomendationList.length; i++){
            expect(recomendationList[i].preco).toBeGreaterThan(0)
        }
    })

    it('usage estatistics validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        expect(response.body.estatisticasDeUso.horasConectado).toBeGreaterThan(0)
        expect(response.body.estatisticasDeUso.diasAtivo).toBeGreaterThan(0)
    })

    it('friends validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        const friendsList = response.body.amigos

        for(let i = 0; i < friendsList.length; i++){
            expect(friendsList[i].nome).not.toBeNull()

            let contato = friendsList[i].contato
                
            if(contato != null){
                expect(contato).toMatch(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            }
        }        
    })

    it('preferences validations', async() => {
        let response =
            await request(route)
                .get('/json_1');

        const favoriteCategoriesList = response.body.preferencias.categoriasFavoritas

        expect(favoriteCategoriesList).not.toBeNull()
        expect(typeof response.body.preferencias.notificarPromocoes).toBe('boolean')
    })
})