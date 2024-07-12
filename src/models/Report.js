const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./User');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assunto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descriscao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resolvido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: false, // Disable timestamps
  hooks: {
    // Inserir dados pré-definidos após a sincronização
    afterSync: async () => {
      try {
        // Exemplo de inserção de dados pré-definidos
        await Report.bulkCreate([
          {
            assunto: 'Assunto 1',
            descriscao: 'Descrição 1',
            resolvido: false,
            userId: 1
          },
          {
            assunto: 'Assunto 2',
            descriscao: 'Descrição 2',
            resolvido: true,
            userId: 2
          }
          // Adicione mais registros conforme necessário
        ]);
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Report:', error);
      }
    }
  }
});

Report.belongsTo(User, { foreignKey: 'userId' });

module.exports = Report;
