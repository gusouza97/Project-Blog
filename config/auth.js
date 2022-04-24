// Importando a estrategia local
const localStrategy = require("passport-local").Strategy

// Importando o mongoose
const mongoose = require("mongoose")

// Importando o Bcryptjs
const bcrypt = require("bcryptjs")

// Model de usuario
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")



module.exports = function(passport){
    // Estamos definindo no usernameField a chave da autenticacao... que no caso seria email, username ou outro
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done) => {

        // Pesquisando um email igual foi passado na autenticacao
        Usuario.findOne({email: email}).then((usuario) => {
            // Verificando se o usuario existe no sistema
            if(!usuario){
                // Declarando a funcao done, informando null e false com uma mensagem
                return done(null, false, {message: "Esta conta nao existe"})
            }

            // Comparando as senhas hashs utilizando o compare()
            bcrypt.compare(senha, usuario.senha, (err, equals) => {
                if(equals){
                    // Declarando a funcao done, passando o usuario
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })

    }))

    // Salvando os dados do usuario em uma sessao
    passport.serializeUser((usuario, done) =>{

        done(null, usuario.id)

    })
    
    // Salvando os dados do usuario em uma sessao
    passport.deserializeUser((id, done) => {
        // Procurando um usuario pelo ID dele
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })

}