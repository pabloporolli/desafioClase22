import knex from 'knex'
import config from '../src/config.js'


// const mysqlClient = knex(config.mysql)

// mysqlClient.schema.dropTableIfExists('productos')

// mysqlClient.schema.createTable('productos', table => {
//     table.increments('id')
//     table.string('name')
//     table.integer('price')
//     table.string('url')
// })
//     .then( () => console.log('tabla productos creada con éxito'))
//     .catch((err) => {console.log(err); throw err})
//     .finally(() => {
//         mysqlClient.destroy
//     })



//-----------------------------------
// Crar tabla en SQLite3

const sqliteClient = knex(config.sqlite3)
sqliteClient.schema.createTable('mensajes', table => {
    table.string('email')
    table.string('text')
})
    .then( () => console.log('Tabla Sqlite creada'))
    .catch((err) => {console.log(err); throw err})
    .finally(() => {
        sqliteClient.destroy
    })