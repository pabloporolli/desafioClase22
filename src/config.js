export default {
    mysql: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'desafio8',  // Acá va el nombre de la DB
            port: 8889
        }
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: '../DB/ecommerce.sqlite'
        },
        useNullAsDefault: true
    }
}