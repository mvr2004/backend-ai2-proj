// src/routes/estabelecimentoRoutes.js
const express = require('express');
const estabelecimentoController = require('../controllers/estabelecimentoController'); 
const avaliacaoEstabelecimentoController = require('../controllers/avaliacaoEstabelecimentoController');
const router = express.Router();
const upload = require('../configs/multer');


// Rota para criar um estabelecimento
router.post('/criarestab', upload.single('foto'), estabelecimentoController.createEstablishment);

// Rota para buscar todos os estabelecimentos
router.get('/list', estabelecimentoController.getAllEstablishments);

// Rota para buscar o estabelecimento pelo nome
router.get('/estabname', estabelecimentoController.getEstablishmentsByName);

// Rota para buscar estabelecimentos por uma ou várias áreas de interesse
router.get('/estabareaecemtrp', estabelecimentoController.getEstablishmentsByAreasAndCentro);


// Rota para buscar um estabelecimento pelo ID
router.get('/estab/:id', estabelecimentoController.getEstablishmentById);


// Rota para criar uma avaliação de estabelecimento
router.post('/avaliacao', avaliacaoEstabelecimentoController.createEstabelecimentoReview);

// Rota para listar as avaliações de um estabelecimento
router.get('/avaliacao/:establishmentId', avaliacaoEstabelecimentoController.listEstabelecimentoReviews);

// Rota para calcular a média das avaliações de um estabelecimento e o número de avaliações
router.get('/avaliacao/media/:establishmentId', avaliacaoEstabelecimentoController.calculateEstabelecimentoAverageRating);




module.exports = router;
