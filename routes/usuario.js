const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")

const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model('usuarios')

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email invalido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha invalida"})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas sao diferentes, tente novamente!"})
    }

    if(erros.length > 0){
        
        res.render("usuarios/registro", {erros: erros})

    }else{
        // Realizando uma verificacao se o email, ja existe em nossa base de dados
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Ja existe uma conta com este email")
                res.redirect("/usuarios/registro")
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Hove um erro durante o salvamento do usuario")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro durante a criacao do usuario")
                            res.redirect("/usuarios/registro")
                        })
                    })
                })

                

            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })

    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {

    // Funcao sempre utilizada caso queira autenticar qualquer coisa
    passport.authenticate("local", {
        // Redirecionando o usuario para rota em caso de sucesso
        successRedirect: "/",
        //Redirecionando o usuario em caso de erro
        failureRedirect: "/usuarios/login",
        // Habilitando as Flash Messages
        failureFlash: true
    })(req, res, next)
})

module.exports = router