const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const bcrypt = require('bcrypt');
const Centro = require('./Centro');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fotoUrl: {
    type: DataTypes.STRING
  },
  Ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  centroId: {
    type: DataTypes.INTEGER,
    references: {
      model: Centro,
      key: 'id'
    }
  }
}, {
  timestamps: false, // Removido timestamps
  hooks: {
    // Antes de criar ou atualizar um usuário
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
      }
    },
    // Inserir dados pré-definidos após a sincronização inicial
    afterSync: async () => {
      try {
        const existingUsers = await User.count();
        if (existingUsers === 0) {
          const salt = await bcrypt.genSalt(10);
          const hashedPasswordJoao = await bcrypt.hash('123', salt); 
          const hashedPasswordJane = await bcrypt.hash('123', salt); 
          await User.bulkCreate([
            {
              nome: 'João Silva',
              email: 'john.silvs@example.com',
              password: hashedPasswordJohn,
              fotoUrl: 'https://example.com/john.jpg',
              Ativo: false,
              notas: 'Despediu-se e tratou mal o chefe',
              centroId: 1, 
            },
            {
              nome: 'Jane Smith',
              email: 'jane.smith@example.com',
              password: hashedPasswordJane,
              fotoUrl: 'https://example.com/jane.jpg',
              Ativo: true,
              centroId: 2, // ID do centro ao qual Jane Smith está associada
            },
            {
              nome: 'Maria Silva',
              email: 'maria.silva@example.com',
              password: await bcrypt.hash('senhaMariaSilva', salt), // Exemplo de criação de senha criptografada inline
              fotoUrl: 'https://example.com/maria.jpg',
              Ativo: true,
              centroId: 3, // ID do centro ao qual Maria Silva está associada
            },
            {
              nome: 'Carlos Santos',
              email: 'carlos.santos@example.com',
              password: await bcrypt.hash('senhaCarlosSantos', salt),
              fotoUrl: 'https://example.com/carlos.jpg',
              Ativo: true,
              centroId: 1, // ID do centro ao qual Carlos Santos está associado
            },
            {
              nome: 'Ana Oliveira',
              email: 'ana.oliveira@example.com',
              password: await bcrypt.hash('senhaAnaOliveira', salt),
              fotoUrl: 'https://example.com/ana.jpg',
              Ativo: true,
              centroId: 2, // ID do centro ao qual Ana Oliveira está associada
            },
            {
              nome: 'Pedro Rodrigues',
              email: 'pedro.rodrigues@example.com',
              password: await bcrypt.hash('senhaPedroRodrigues', salt),
              fotoUrl: 'https://example.com/pedro.jpg',
              Ativo: true,
              centroId: 3, // ID do centro ao qual Pedro Rodrigues está associado
            },
            {
              nome: 'Sofia Costa',
              email: 'sofia.costa@example.com',
              password: await bcrypt.hash('senhaSofiaCosta', salt),
              fotoUrl: 'https://example.com/sofia.jpg',
              Ativo: true,
              centroId: 1, // ID do centro ao qual Sofia Costa está associada
            },
            {
              nome: 'Miguel Ferreira',
              email: 'miguel.ferreira@example.com',
              password: await bcrypt.hash('senhaMiguelFerreira', salt),
              fotoUrl: 'https://example.com/miguel.jpg',
              Ativo: true,
              centroId: 2, // ID do centro ao qual Miguel Ferreira está associado
            },
            {
              nome: 'Beatriz Almeida',
              email: 'beatriz.almeida@example.com',
              password: await bcrypt.hash('senhaBeatrizAlmeida', salt),
              fotoUrl: 'https://example.com/beatriz.jpg',
              Ativo: true,
              centroId: 3, // ID do centro ao qual Beatriz Almeida está associada
            },
            {
              nome: 'Rui Gomes',
              email: 'rui.gomes@example.com',
              password: await bcrypt.hash('senhaRuiGomes', salt),
              fotoUrl: 'https://example.com/rui.jpg',
              Ativo: true,
              centroId: 1, // ID do centro ao qual Rui Gomes está associado
            },
            {
              nome: 'Joana Sousa',
              email: 'joana.sousa@example.com',
              password: await bcrypt.hash('senhaJoanaSousa', salt),
              fotoUrl: 'https://example.com/joana.jpg',
              Ativo: true,
              centroId: 2, // ID do centro ao qual Joana Sousa está associada
            }
            // Adicione mais registros conforme necessário
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de User:', error);
      }
    }
  }
});

User.belongsTo(Centro, { foreignKey: 'centroId' });

module.exports = User;
