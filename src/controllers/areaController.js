const Area = require('../models/Area');
const Subarea = require('../models/Subarea'); 
const UserArea = require('../models/UtilizadorArea');


// Controller para consultar todas as áreas
const getAllAreas = async (req, res, next) => {
  try {
    const areas = await Area.findAll();
    res.json({ areas });
  } catch (error) {
    console.error('Erro ao buscar todas as áreas:', error);
    next(error);
  }
};

// Controller para consultar as subáreas de uma área específica
const getSubareasByAreaId = async (req, res, next) => {
  const { areaId } = req.params;
  try {
    const subareas = await Subarea.findAll({
      where: { areaId: areaId },
      include: [{ model: Area, attributes: ['id', 'nomeArea'] }],
    });
    res.json({ subareas });
  } catch (error) {
    console.error('Erro ao buscar subáreas por área:', error);
    next(error);
  }
};


// Controller para associar um usuário a uma área
const associateUserWithArea = async (req, res, next) => {
  try {
    const { userId, areaId } = req.body;
    const association = await UserArea.create({ userId, areaId });
    res.status(201).json({ association });
  } catch (error) {
    console.error('Erro ao associar usuário com área:', error);
    next(error);
  }
};


module.exports = {
  getAllAreas,
  getSubareasByAreaId,
  associateUserWithArea,
};
