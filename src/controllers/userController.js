const { Op } = require('sequelize');
const User = require('../models/User');
const Centro = require('../models/Centro'); // Importe o modelo Centro se necessário
const path = require('path');
const upload = require('../configs/multer'); // Importe o multer configurado

const userController = {};

// Adicionar um novo utilizador
userController.addUser = async (req, res) => {
  try {
    const { nome, email, password, centroId } = req.body;
    const fotoUrl = req.file ? 'https://backend-ai2-proj.onrender.com/uploads/' + req.file.filename : null;

    // Verifique se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Crie o novo utilizador
    const user = await User.create({ nome, email, password, fotoUrl, centroId });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar adicionar o utilizador', error });
  }
};

// Atualizar 
userController.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email, password, centroId, notas, ativo } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'utilizador não encontrado' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso por outro utilizador' });
      }
    }

    user.nome = nome || user.nome;
    user.email = email || user.email;
    user.password = password || user.password;
    user.centroId = centroId || user.centroId;
    user.notas = notas || user.notas;
    user.ativo = ativo !== undefined ? ativo : user.ativo; // Atualiza o campo ativo se fornecido

    if (req.file) {
      user.fotoUrl = 'https://backend-ai2-proj.onrender.com/uploads/' + req.file.filename;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar atualizar o utilizador', error });
  }
};



// Listar todos os utilizadors
userController.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar os utilizadors', error });
  }
};

// Buscar utilizador por nome, ID ou email
userController.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const searchQuery = search.toLowerCase(); // Converta para minúsculas para busca insensível a maiúsculas/minúsculas

    let users;
    if (!isNaN(searchQuery)) { // Verifica se searchQuery é um número
      users = await User.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.iLike]: `%${searchQuery}%` } }, // iLike para busca insensível a maiúsculas/minúsculas no PostgreSQL
            { email: { [Op.iLike]: `%${searchQuery}%` } },
            { id: searchQuery } // Procura por ID apenas se searchQuery for um número
          ]
        },
        include: Centro // Inclua o modelo Centro para acessar os dados do centro
      });
    } else {
      users = await User.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.iLike]: `%${searchQuery}%` } },
            { email: { [Op.iLike]: `%${searchQuery}%` } }
          ]
        },
        include: Centro // Inclua o modelo Centro para acessar os dados do centro
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o utilizador', error });
  }
};


// Filtrar utilizadors por estado ativo ou inativo
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
    res.status(500).json({ message: 'Erro ao filtrar os utilizadors', error });
  }
};

// Filtrar utilizadors por centroId
userController.filterUsersByCentro = async (req, res) => {
  const { centroId } = req.params;

  try {
    const users = await User.findAll({
      where: { centroId },
      include: Centro // Inclua o modelo Centro para acessar os dados do centro
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar os utilizadors por centro', error });
  }
};

// Deletar um utilizador
userController.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'utilizador não encontrado' });
    }

    user.ativo = false; // Define o utilizador como inativo

    await user.save();
    res.status(200).json({ message: 'utilizador inativado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao inativar o utilizador', error });
  }
};

module.exports = userController;
