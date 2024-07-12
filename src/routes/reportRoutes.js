const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const upload = require('../configs/multer');

// Rota para listar todos os reports
router.get('/reports', reportController.listReports);

// Rota para atualizar o status de resolvido de um report
router.put('/reports/:id', reportController.updateReportStatus);

// Rota para criar um novo report com upload de foto
router.post('/reports', upload.single('image'), reportController.createReport);

module.exports = router;
