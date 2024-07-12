const Filme = require('../models/movie');
const Genero = require('../models/genre');
const controllers = {};

controllers.lista_filme = async (req, res) => {
    try {
        const data = await Filme.findAll({ include: [Genero] });
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

controllers.criar_filme = async (req, res) => {
    try {
        const { titulo, descricao, generoId } = req.body;
        const foto = req.file ? req.file.filename : null;

        const data = await Filme.create({
            titulo: titulo,
            foto: foto,
            descricao: descricao,
            generoId: generoId
        });

        res.status(200).json({
            success: true,
            message: "Filme adicionado!",
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

controllers.atualizar_filme = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, generoId } = req.body;
        const foto = req.file ? req.file.filename : null;

        const filme = await Filme.findOne({ where: { id: id } });

        if (!filme) {
            return res.status(404).json({ success: false, message: "Filme não encontrado!" });
        }

        filme.titulo = titulo;
        filme.descricao = descricao;
        filme.generoId = generoId;

        if (foto) {
            filme.foto = foto;
        }

        await filme.save();

        res.json({ success: true, data: filme, message: "Filme atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

controllers.apagar_filme = async (req, res) => {
    try {
        const { id } = req.params;
        const numDeleted = await Filme.destroy({ where: { id: id } });

        if (numDeleted > 0) {
            res.json({ success: true, message: "Filme apagado!" });
        } else {
            res.status(404).json({ success: false, message: "Filme não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

controllers.obter_filme = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Filme.findOne({
            include: [Genero],
            where: { id: id }
        });
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};

module.exports = controllers;
