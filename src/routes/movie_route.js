const express = require('express');
const router = express.Router();
const ControladorFilme = require('../controllers/movie_controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Certifique-se de configurar o destino correto para os uploads

router.get('/list', ControladorFilme.lista_filme);
router.get('/get/:id', ControladorFilme.obter_filme);
router.post('/create', upload.single('foto'), ControladorFilme.criar_filme);
router.put('/update/:id', upload.single('foto'), ControladorFilme.atualizar_filme);
router.delete('/delete/:id', ControladorFilme.apagar_filme);

module.exports = router;
