// userController.js

const { Op } = require('sequelize');
const User = require('../models/User');
const Centro = require('../models/Centro'); // Importe o modelo Centro se necessário
const path = require('path');
const upload = require('../configs/multer'); // Importe o multer configurado

const userController = {};

// Adicionar um novo usuário
userController.addUser = async (req, res) => {
  try {
    const { nome, email, password, notas, centroId } = req.body;
    const fotoUrl = req.file ? 'https://backend-ai2-proj.onrender.com/uploads/' + req.file.filename : null;

    // Verifique se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Crie o novo usuário
    const user = await User.create({ nome, email, password, fotoUrl, notas, centroId });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar adicionar o usuário', error });
  }
};

// Atualizar um usuário
userController.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email, password, notas, centroId } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifique se o novo email está em uso por outro usuário
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso por outro usuário' });
      }
    }

    // Atualize os campos fornecidos
    user.nome = nome || user.nome;
    user.email = email || user.email;
    user.password = password || user.password;
    user.notas = notas || user.notas;
    user.centroId = centroId || user.centroId;

    if (req.file) {
      user.fotoUrl = 'https://backend-ai2-proj.onrender.com/uploads/' + req.file.filename;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar atualizar o usuário', error });
  }
};

// Listar todos os usuários
userController.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar os usuários', error });
  }
};

// Buscar usuário por nome, ID ou email
userController.findUser = async (req, res) => {
  try {
    const { search } = req.query;
    const whereCondition = isNaN(search)
      ? {
          [Op.or]: [
            { nome: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        }
      : { id: search };

    const users = await User.findAll({
      where: whereCondition,
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o usuário', error });
  }
};

// Filtrar usuários por estado ativo ou inativo
userController.filterUsers = async (req, res) => {
  try {
    const { status } = req.query;
    const isActive = status === 'ativo';
    const users = await User.findAll({
      where: { Ativo: isActive },
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar os usuários', error });
  }
};

// Filtrar usuários por centroId
userController.filterUsersByCentro = async (req, res) => {
  const { centroId } = req.params;

  try {
    const users = await User.findAll({
      where: { centroId },
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar os usuários por centro', error });
  }
};

module.exports = userController;
