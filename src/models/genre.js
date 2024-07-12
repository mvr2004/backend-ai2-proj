const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const Genero = SequelizeDB.define('genero', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
});

module.exports = Genero;
