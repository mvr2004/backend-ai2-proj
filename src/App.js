const express = require('express');
const path = require('path');
const sequelize = require('./models/database');
const genreRoute = require('./routes/genre_route');
const movieRoute = require('./routes/movie_route');

const app = express();

app.set('port', process.env.PORT || 8080);

// Configurar a pasta de uploads como estática
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configuração de headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas
app.use('/genre', genreRoute);
app.use('/movie', movieRoute);

// Rota padrão para outras solicitações
app.use('/', (req, res) => {
    res.send('Bem-vindo ao servidor de filmes e gêneros');
});

// Função para adicionar dados de exemplo nas tabelas quando elas forem criadas pela primeira vez
const addSampleData = async () => {
    const Genero = require('./models/genre'); // Moved inside the function
    const Filme = require('./models/movie');  // Moved inside the function

    try {
        // Verificar se as tabelas já existem
        const generosExists = await sequelize.queryInterface.describeTable('generos').then(() => true).catch(() => false);
        const filmesExists = await sequelize.queryInterface.describeTable('filmes').then(() => true).catch(() => false);

        if (!generosExists) {
            await Genero.sync();
            await Genero.bulkCreate([
                { descricao: 'Ação' },
                { descricao: 'Comédia' },
                { descricao: 'Drama' }
            ]);
            console.log('Tabela de gêneros criada e dados de exemplo inseridos.');
        }

        if (!filmesExists) {
            await Filme.sync();
            await Filme.bulkCreate([
                { titulo: 'Rambo', descricao: 'Descrição do Rambo', foto: '128aac1b200256fe0c75d9ae0b3e8227', generoId: 1 },
                { titulo: 'Senhor dos Anéis', descricao: 'Descrição do Filme 2', foto: 'f98d6890f55db711a4c6485c902074d8', generoId: 1 },
            ]);
            console.log('Tabela de filmes criada e dados de exemplo inseridos.');
        }
    } catch (error) {
        console.error('Erro ao adicionar dados de exemplo:', error);
    }
};

// Chamar a função para adicionar dados de exemplo
addSampleData();

// Iniciar o servidor
app.listen(app.get('port'), () => {
    console.log("Servidor iniciado na porta " + app.get('port'));
});
