// controllers/userAreaController.js

const { User, Area, UserArea } = require('../models');

// Adicionar uma área de interesse a um usuário
exports.addUserArea = async (req, res) => {
  const { userId, areaId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const area = await Area.findByPk(areaId);
    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }

    // Verifica se a relação já existe
    const existingUserArea = await UserArea.findOne({
      where: { userId, areaId }
    });

    if (existingUserArea) {
      return res.status(400).json({ error: 'Usuário já tem interesse nesta área' });
    }

    // Cria a relação UserArea
    await UserArea.create({ userId, areaId });

    return res.status(201).json({ message: 'Área de interesse adicionada com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar área de interesse ao usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Listar áreas de interesse de um usuário
exports.listUserAreas = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Area, through: UserArea }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const areas = user.Areas.map(area => ({
      id: area.id,
      nomeArea: area.nomeArea
    }));

    return res.status(200).json(areas);
  } catch (error) {
    console.error('Erro ao listar áreas de interesse do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
