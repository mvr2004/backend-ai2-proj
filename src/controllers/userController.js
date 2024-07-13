const { Op } = require('sequelize');
const User = require('../models/User');
const Centro = require('../models/Centro'); // Importe o modelo Centro se necessário
const path = require('path');
const upload = require('../configs/multer'); // Importe o multer configurado

const userController = {};

// Adicionar um novo usuário
userController.addUser = async (req, res) => {
  try {
    const { nome, email, password, centroId } = req.body;
    const fotoUrl = req.file ? 'https://backend-ai2-proj.onrender.com/uploads/' + req.file.filename : null;

    // Verifique se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Crie o novo usuário
    const user = await User.create({ nome, email, password, fotoUrl, centroId });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar adicionar o usuário', error });
  }
};

// Atualizar um usuário
userController.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email, password, centroId, notas } = req.body; // Adicionando notas aqui

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
    user.centroId = centroId || user.centroId;
    user.notas = notas || user.notas; // Atualiza as notas se fornecidas

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
userController.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const searchQuery = search.toLowerCase(); // Converta para minúsculas para busca insensível a maiúsculas/minúsculas

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.iLike]: `%${searchQuery}%` } }, // iLike para busca insensível a maiúsculas/minúsculas no PostgreSQL
          { email: { [Op.iLike]: `%${searchQuery}%` } },
          { id: searchQuery } // Procura por ID
        ]
      },
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

// Deletar um usuário
userController.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o usuário', error });
  }
};

module.exports = userController;
