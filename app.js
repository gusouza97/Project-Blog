// Carregando os modulos-bibliotecas
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')

const admin = require('./routes/admin')

// Definindo a variavel que vai receber o Express
const app = express();



// Configuracaoes
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Handlebars
app.engine('handlebars', handlebars.engine({

    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set('view engine', 'handlebars');
app.set('views', './views')

// Mongoose


// Rotas

app.get('/', (req, res) => {
    res.send("Rota Principal")
})

app.get('/posts', (req, res) => {
    res.send("Lista de Posts")
})

// Usando o arquivo de rotas externo - ADMIN
app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando!")
})