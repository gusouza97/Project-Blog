module.exports = {
    eAdmin: function(req, res, next){
        // Verificando se o usuario esta autenticado com essa funcao do passport
        // Verificando tambem se o user corresponde a um Admin no banco de dados
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }

        req.flash("error_msg", "Acesso restrito")
        res.redirect("/")
s
    }
}