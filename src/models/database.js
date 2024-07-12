const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'ai2',
    'postgres',
    'postgres',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres',
        logging: false, // Disable logging
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a base de dados.');
    } catch (error) {
        console.error('Nºao consegui conectar a BD:', error);
    }
};

connectDB();

module.exports = sequelize;
