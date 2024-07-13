const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./User');
const Evento = require('./Evento');

// Ensure User and Evento are correctly defined and imported
if (!User || !User.prototype instanceof sequelize.Model) {
    throw new Error('User model is not defined correctly');
}

if (!Evento || !Evento.prototype instanceof sequelize.Model) {
    throw new Error('Evento model is not defined correctly');
}

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

// Define associations
User.belongsToMany(Evento, { through: ParticipacaoEvento, foreignKey: 'utilizadorId' });
Evento.belongsToMany(User, { through: ParticipacaoEvento, foreignKey: 'eventoId' });

module.exports = ParticipacaoEvento;
