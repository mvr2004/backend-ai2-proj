const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Genero = require('./genre');

const Filme = SequelizeDB.define('filmes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foto: Sequelize.STRING,
    descricao: Sequelize.STRING,
    generoId: {
        type: Sequelize.INTEGER,
        references: {
            model: Genero,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Filme.belongsTo(Genero, { foreignKey: 'generoId' });

module.exports = Filme;
