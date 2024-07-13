const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../configs/multer'); // Importe o multer configurado se necessário

// Rota para adicionar um novo usuário
router.post('/add', upload.single('foto'), userController.addUser);

// Rota para atualizar um usuário
router.put('/update/:id', upload.single('foto'), userController.updateUser);

// Rota para listar todos os usuários
router.get('/list', userController.listUsers);

// Rota para buscar usuário por nome, ID ou email
router.get('/find', userController.findUser);

//Rota para listar utilizador por nome, ID ou email
router.get('/search', userController.findUser);

// Rota para filtrar usuários por status (ativo/inativo)
router.get('/filter', userController.filterUsers);

// Rota para filtrar usuários por centroId
router.get('/filterByCentro/:centroId', userController.filterUsersByCentro);

module.exports = router;
