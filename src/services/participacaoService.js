// services/participacaoService.js

const ParticipacaoEvento = require('../models/UtilizadorEventos');
const Utilizador = require('../models/Utilizador');
const Evento = require('../models/Evento');

// Função para adicionar um usuário a um evento
const addUserToEvent = async (utilizadorId, eventoId) => {
    try {
        // Verifica se o usuário existe
        const user = await Utilizador.findByPk(utilizadorId);
        if (!user) {
            throw new Error('Usuário não encontrado com o ID fornecido.');
        }

        // Cria a participação no evento
        const participacao = await ParticipacaoEvento.create({ utilizadorId, eventoId });
        return participacao;
    } catch (error) {
        throw new Error('Erro ao adicionar usuário ao evento: ' + error.message);
    }
};


// Função para remover um usuário de um evento
const removeUserFromEvent = async (utilizadorId, eventoId) => {
    try {
        await ParticipacaoEvento.destroy({
            where: {
                utilizadorId,
                eventoId
            }
        });
    } catch (error) {
        throw new Error('Erro ao remover usuário do evento: ' + error.message);
    }
};

// Função para obter todos os usuários de um evento
const getUsersByEvent = async (eventoId) => {
    try {
        const utilizadores = await Utilizador.findAll({
            include: [{
                model: Evento,
                where: { id: eventoId },
                through: { attributes: [] }
            }]
        });
        return utilizadores;
    } catch (error) {
        throw new Error('Erro ao obter usuários do evento: ' + error.message);
    }
};

// Função para obter todos os eventos de um usuário
const getEventsByUser = async (utilizadorId) => {
  try {
    const eventos = await Evento.findAll({
      include: {
        model: Utilizador,
        where: { id: utilizadorId }
      }
    });
    return eventos;
  } catch (error) {
    throw new Error('Erro ao obter eventos do usuário: ' + error.message);
  }
};


module.exports = {
    addUserToEvent,
    removeUserFromEvent,
    getUsersByEvent,
    getEventsByUser
};
