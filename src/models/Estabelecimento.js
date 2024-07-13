// models/Estabelecimento.js

const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Subarea = require('./Subarea');
const Centro = require('./Centro');

const Estabelecimento = sequelize.define('Estabelecimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localizacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: { // Corrigido de "descriscao" para "descricao"
        type: DataTypes.STRING,
        allowNull: true
    },
    pago: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subareaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subarea,
            key: 'id'
        }
    },
    centroId: { 
        type: DataTypes.INTEGER,
        references: {
            model: Centro,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingEstabelecimentos = await Estabelecimento.count();
                if (existingEstabelecimentos === 0) {
                    await Estabelecimento.bulkCreate([
                        {
                            nome: 'Restaurante do Migas',
                            localizacao: 'Rua das Flores, Figueira da Foz',
                            contacto: '+351 123 456 789',
                            descricao: 'Restaurante tradicional português',
                            pago: true,
                            foto: 'https://backend-ai2-proj.onrender.com/uploads/restaurante.jpg',
                            subareaId: 14, 
                            centroId: 1 
                        },
                        {
                            nome: 'Ginasio - Academia RamboDaSanta',
                            localizacao: 'Avenida S.Mamede, Santa Cruz da Trapa',
                            contacto: '+351 987 654 321',
                            descricao: 'Ginasio de musculação e fitness',
                            pago: true,
                            foto: 'https://backend-ai2-proj.onrender.com/uploads/ginasio.jpg',
                            subareaId: 4, 
                            centroId: 1 
                        }
                        // Adicione mais registros conforme necessário
                    ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de Estabelecimento:', error);
            }
        }
    }
});

Subarea.hasMany(Estabelecimento, { foreignKey: 'subareaId' });
Estabelecimento.belongsTo(Subarea, { foreignKey: 'subareaId' });

Centro.hasMany(Estabelecimento, { foreignKey: 'centroId' });
Estabelecimento.belongsTo(Centro, { foreignKey: 'centroId' });

module.exports = Estabelecimento;