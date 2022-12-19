import knex from "knex"

class ContenedorDB {

    constructor(config, tabla){
        this.knex = knex(config)
        this.tabla = tabla
    }

    async save(elemento) {
        try {
            const knexConnect = this.knex
            const tabla = this.tabla
            await knexConnect(tabla).insert(elemento)
                .then(() => console.log('datos cargados'))
                .catch((err) => {console.log(err); throw err})
                .finally(() => {
                    this.knex.destroy
                })
        }
        catch (error) {
            console.log(error)
        }
    }

    async getAll() {
        try {
            const knexConnect = this.knex
            const tabla = this.tabla
            const data = await knexConnect.from(tabla).select('*')
            return data
        }
        catch (error) {
            console.log(error)
        }
    }


}

export default ContenedorDB