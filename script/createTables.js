import knex from 'knex'
import config from '../src/config.js'


const mysqlClient = knex(config.mysql)

mysqlClient.schema.dropTableIfExists('productos')

mysqlClient.schema.createTable('productos', table => {
    table.increments('id')
    table.string('name')
    table.integer('price')
    table.string('url')
})
    .then( () => console.log('tabla productos creada con éxito'))
    .catch((err) => {console.log(err); throw err})
    .finally(() => {
        mysqlClient.destroy
    })



// -----------------------------------
// Crar tabla en SQLite3

const sqliteClient = knex(config.sqlite3)

async function crearTabla () {

    try {

        await sqliteClient.schema.createTable('mensajes', table => {
            table.string('email')
            table.string('text')
            console.log('Tabla creada');
        })
        
    } catch (error) {
        console.log(error);
    } finally {
        sqliteClient.destroy
    }

}

crearTabla()