const Report = require('../models/Report');
const User = require('../models/User');
const path = require('path');

const reportController = {};

// Listar todos os reports, incluindo o nome, email e ID do utilizador
reportController.listReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'nome', 'email']
        }
      ]
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar encontrar os reports', error });
  }
};

// Atualizar o status de resolvido do report
reportController.updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { resolvido } = req.body;

  try {
    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report não encontrado' });
    }

    report.resolvido = resolvido;
    await report.save();

    res.status(200).json({ success: true, message: 'Status do report atualizado com sucesso', report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar status do report', error });
  }
};

// Criar um novo report com upload de foto
reportController.createReport = async (req, res) => {
  try {
    const { assunto, descriscao, userId } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const report = await Report.create({
      assunto,
      descriscao,
      imageUrl,
      userId
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o report', error });
  }
};

module.exports = reportController;