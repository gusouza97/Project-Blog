// Chamando o modulo Express
const express = require("express")

// Funcao armazenada para criarmos rotas em arquivos separados
const router = express.Router()

// Rotas
router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Pagina de Posts")
})

router.get('/categorias', (req, res) => {
    res.send("Pagina de categorias")
})

// Exportando o router
module.exports = router