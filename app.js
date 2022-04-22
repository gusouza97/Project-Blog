// Carregando os modulos-bibliotecas
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

require("./models/Postagem")
const Postagem = mongoose.model("postagens")

// Definindo a variavel que vai receber o Express
const app = express();

// ---------------------------------- Configuracaoes ----------------------------------
// Session
// Middleware para criacao de uma sessao
app.use(session({
    secret: "test", // Importante que essa Secret seja segura
    resave: true,
    saveUninitialized: true
}))
//Configurando o flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
    // Declarando variaveis globais
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next();
})

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
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Conectado ao banco de dados com sucesso!")
})
.catch((err) => {
    console.log("Houve um erro em se conectar: " + err);
})

// Public
// Informando o Express que todos os arquivos estaticos estao na pasta Public
app.use(express.static(path.join(__dirname, 'public')));


// ---------------------------------- Rotas ----------------------------------

app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        req.redirect("/404")
    })
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) => {
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Esta postagem nao existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno " + err )
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send("Error 404!")
})

app.get('/posts', (req, res) => {
    res.send("Lista de Posts")
})

// Usando o arquivo de rotas externo - ADMIN
app.use('/admin', admin)

// ---------------------------------- Outros ----------------------------------
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando!")
})