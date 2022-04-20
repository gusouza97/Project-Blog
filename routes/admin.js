const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

// Rotas
router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Pagina de Posts")
})

router.get('/categorias', (req, res) => {
    // Trazendo todas as informacoes da collection
    Categoria.find().sort({date: 'desc'})
    .then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    })
    .catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.post("/categorias/nova", (req, res) => {

    // Verificando o formulario enviado pelo usuario
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug invalido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria eh muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save()
        .then(() => {
            // Armazenando uma Flash Message de Sucesso
            req.flash("success_msg", "Categoria criada com sucesso")
            // Redirecionando o usuario para a pagina de lista de categorias
            res.redirect("/admin/categorias")
        })
        .catch((err) => {
            // Armazenando uma Flash Message de Erro
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente")
            // Redirecionando o usuario para a pagina de admin
            res.redirect("/admin")
        })
    }
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

// Exportando o router
module.exports = router