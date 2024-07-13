const { Op } = require('sequelize');
const User = require('../models/User');
const path = require('path');
const upload = require('../configs/multer'); // Importe o módulo multer configurado

const userController = {};

// Adicionar um novo utilizador
userController.addUser = async (req, res) => {
  try {
    const { nome, email, password, notas, centroId } = req.body;
    const fotoUrl = req.file ? '/uploads/' + req.file.filename : null; // Link completo da foto

    // Verifique se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Se o email não está em uso, crie o novo utilizador
    const utilizador = await User.create({ nome, email, password, fotoUrl, notas, centroId });
    res.status(201).json(utilizador);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar adicionar o utilizador', error });
  }
};

// Atualizar um utilizador
userController.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email, password, notas, centroId } = req.body;

  try {
    const utilizador = await User.findByPk(id);
    if (!utilizador) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    // Verifique se o novo email está em uso por outro usuário
    if (email && email !== utilizador.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso por outro utilizador' });
      }
    }

    // Atualize apenas os campos fornecidos
    utilizador.nome = nome || utilizador.nome;
    utilizador.email = email || utilizador.email;
    utilizador.password = password || utilizador.password;
    utilizador.notas = notas || utilizador.notas;
    utilizador.centroId = centroId || utilizador.centroId;

    if (req.file) {
      // Se houver um novo arquivo de foto, atualize a fotoUrl com o link completo
      utilizador.fotoUrl = '/uploads/' + req.file.filename;
    }

    await utilizador.save();
    // Certifique-se de retornar o utilizador atualizado com o link completo da foto
    res.status(200).json(utilizador);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar atualizar o utilizador', error });
  }
};

// Listar todos os utilizadores
userController.listUsers = async (req, res) => {
  try {
    const utilizadores = await User.findAll();
    res.status(200).json(utilizadores);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar listar os utilizadores', error });
  }
};

// Listar utilizador por nome, ID ou email
userController.findUser = async (req, res) => {
  try {
    const { search } = req.query;

    // Verifica se o search é um número para buscar por ID
    const whereCondition = isNaN(search) 
      ? {
          [Op.or]: [
            { nome: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        }
      : { id: search };

    const utilizadores = await User.findAll({
      where: whereCondition
    });

    res.status(200).json(utilizadores);
  } catch (error) {
    console.error('Erro ao buscar utilizador:', error);
    res.status(500).json({ message: 'Erro ao tentar encontrar o utilizador', error });
  }
};

// Filtrar utilizadores por estado ativo ou inativo
userController.filterUsers = async (req, res) => {
  try {
    const { status } = req.query;
    const isActive = status === 'ativo';
    const utilizadores = await User.findAll({
      where: {
        Ativo: isActive
      }
    });
    res.status(200).json(utilizadores);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar filtrar os utilizadores', error });
  }
};

module.exports = userController;
