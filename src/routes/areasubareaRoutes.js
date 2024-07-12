const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const subareaController = require('../controllers/subareaController');

// Rotas para Áreas
router.get('/list', areaController.listAreas);
router.post('/create', areaController.createArea);
router.put('/update/:id', areaController.updateArea);
router.delete('/del/:id', areaController.deleteArea);

// Rotas para Subáreas
router.get('/listsub', subareaController.listSubareas);
router.post('/createsub', subareaController.createSubarea);
router.put('/updatesub/:id', subareaController.updateSubarea);
router.delete('/delsub/:id', subareaController.deleteSubarea);

module.exports = router;
