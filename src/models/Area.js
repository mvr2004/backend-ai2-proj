const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

//Modelo Area
const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomeArea: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
}, {
  timestamps: false 
});

//Exportar modelo
module.exports = Area;
