// Carregando os modulos-bibliotecas
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')

require("./models/Postagem")
const Postagem = mongoose.model("postagens")

require("./models/Categoria")
const Categoria = mongoose.model("categorias")

// Importando o Passport
const passport = require("passport")
require("./config/auth")(passport)

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

// Configurando a sessao do Passport
app.use(passport.initialize())
app.use(passport.session())

//Configurando o flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
    // Declarando variaveis globais
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    // Criando uma variavel global para armazenar o usuario logado, req.user fornecido pelo Passport
    res.locals.user = req.user || null
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

app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao listar categorias")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            
            Postagem.find({categoria: categoria._id}).then((postagens) => {

                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar as postagens")
                res.redirect("/")
            })

        }else{
            req.flash("error_msg", "Esta categoria nao existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno para carregar a pagina desta categoria")
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
app.use('/usuarios', usuarios)

// ---------------------------------- Outros ----------------------------------
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando!")
})