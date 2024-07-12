const Genero = require('../models/genre');
const Filme = require('../models/movie');
const controllers = {};

controllers.lista_genero = async (req, res) => {
    try {
        const data = await Genero.findAll();
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

controllers.criar_genero = async (req, res) => {
    const { descricao } = req.body;
    try {
        const data = await Genero.create({ descricao: descricao });
        res.status(200).json({ success: true, message: "Genero criado com sucesso!", data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

controllers.atualizar_genero = async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;
    try {
        const data = await Genero.update({ descricao: descricao }, {  where: { id: id } });
        res.json({ success: true, data: data, message: "Gênero atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

controllers.apagar_genero = async (req, res) => {
    const { id } = req.params;
    try {
        const generoAssociado = await Filme.findOne({ where: { generoId: id } });
        if (generoAssociado) {
            return res.status(400).json({ success: false, message: "O gênero está associado a um filme e não pode ser removido." });
        }
        await Genero.destroy({ where: { id: id } });
        res.json({ success: true, message: "Gênero removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Ocorreu um erro ao tentar remover o gênero." });
    }
};

controllers.obter_genero = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Genero.findAll({ where: { id: id } });
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

module.exports = controllers;
