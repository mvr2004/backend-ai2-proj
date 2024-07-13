const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../configs/multer'); // Importe o módulo multer configurado

// Rota para adicionar um novo utilizador
router.post('/add', upload.single('foto'), userController.addUser);

// Rota para atualizar um utilizador
router.put('/update/:id', upload.single('foto'), userController.updateUser);

// Rota para listar todos os utilizadores
router.get('/list', userController.listUsers);

// Rota para listar utilizador por nome, ID ou email
router.get('/search', userController.findUser);

// Rota para filtrar utilizadores por estado ativo ou inativo
router.get('/filter', userController.filterUsers);

// Route to list users by centroId
router.get('/filterByCentro/:centroId', userController.filterUsersByCentro);

module.exports = router;
