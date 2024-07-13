const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./User');
const Evento = require('./Evento');

const ParticipacaoEvento = sequelize.define('ParticipacaoEvento', {
  utilizadorId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  eventoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Evento,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  hooks: {
    afterSync: async () => {
      try {
        const existingParticipacoes = await ParticipacaoEvento.count();
        if (existingParticipacoes === 0) {
          await ParticipacaoEvento.bulkCreate([
            { utilizadorId: 1, eventoId: 1 },
            { utilizadorId: 2, eventoId: 1 },
            { utilizadorId: 3, eventoId: 1 },
            { utilizadorId: 1, eventoId: 2 },
            { utilizadorId: 2, eventoId: 2 }
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de ParticipacaoEvento:', error);
      }
    }
  }
});

User.belongsToMany(Evento, { through: ParticipacaoEvento, foreignKey: 'utilizadorId' });
Evento.belongsToMany(User, { through: ParticipacaoEvento, foreignKey: 'eventoId' });

module.exports = ParticipacaoEvento;
