const express = require('express');
const router = express.Router();
const ControladorGenero = require('../controllers/genre_controller'); // Ensure this path is correct

router.get('/list', ControladorGenero.lista_genero);
router.get('/get/:id', ControladorGenero.obter_genero);
router.post('/create', ControladorGenero.criar_genero);
router.put('/update/:id', ControladorGenero.atualizar_genero);
router.put('/delete/:id', ControladorGenero.apagar_genero); // Use `delete` method instead of `put`

module.exports = router;
