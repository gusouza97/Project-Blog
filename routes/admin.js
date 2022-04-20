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

router.get('/categorias/edit/:id', (req, res) => {
    // Fazendo uma busca por um registro
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render("/admin/editcategorias", {categoria: categoria})
    })
    .catch((err) => {
        req.flash("error_msg", "Erro ao editar categoria")
        res.redirect("/admin/categorias")
    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/edit', (req, res) => {

    Categoria.findOne({_id: req.body.id})
    .then((categoria) => {

        // Editando os dados ja existentes no banco de dados
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        })
        .catch((err) => {
            req.flash("error_msg", "Erro ao editar a categoria")
            res.redirect("/admin/categorias")
        })
    })
    .catch((err) => {
        req.flash("error_msg", "Erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id})
    .then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao remover categoria")
        res.redirect("/admin/categorias")
    })
})

// Exportando o router
module.exports = router