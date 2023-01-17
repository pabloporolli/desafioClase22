import express from 'express'
import {Server as HttpServer} from 'http'
import {Server as Socket} from 'socket.io'
import { normalize, schema, denormalize } from 'normalizr'
import util from 'util'

import faker from 'faker'
faker.locale = 'es'

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
app.use('/', express.static('../public'))

import ContenedorDB from '../contenedores/contenedorDB.js'
import config from './config.js'
import ContenedorMensajes from '../contenedores/contenedorMensajes.js'

const productos = new ContenedorDB (config.mysql, 'productos')
const mensajes = new ContenedorMensajes ('../contenedores/mensajes.json')

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');
    
    socket.on('nuevoProducto', data => {
        productos.save(data)
        .then(()=>{
            productos.getAll()
                .then((res) => {
                socket.emit('productos', res) 
            })
        })
    })

    productos.getAll()
        .then((res) => {
            socket.emit('productos', res)
        })
    
    // ----- FUNCIÓN PARA NORMALIZAR MENSAJES -----

    function print(objeto) {
        console.log(util.inspect(objeto, false, 12, true));
    }
    
    const author = new schema.Entity('authors', {}, { idAttribute: 'email' })
    const mensaje = new schema.Entity('text', {author: author})
    const mensajesPost = new schema.Entity('posts', { mensajes: [mensaje] })

    function normalizarMensaje(mens) {

        const normalizedData = normalize(mens, mensajesPost)
        print(normalizedData)
        console.log("RESULTADO FUNCION: ", normalizedData);
        return normalizedData
    }
            
    socket.on('nuevoMensaje', async data => {

        try {
            await mensajes.save(data)
            const listaMensajes = await mensajes.getAll()
            const dataNormalizada = normalizarMensaje(listaMensajes)
            socket.emit('mensajes', dataNormalizada)

        } catch (error) {
            console.log("Error al normalizar: ", error);
        }


        // const dataNormalizada = normalizarMensaje(data)
        // .then (() => {
        //     mensajes.save(dataNormalizada)
        // })
        // .then(() => {
        //     mensajes.getAll()
        //     .then((res) => {
        //         socket.emit('mensajes', res)
        //     })
        // })


    })

    mensajes.getAll()
        .then((res) => {
            socket.emit('mensajes', res)
        })

})


//---------------FAKER----------------
function creaCombinacionesRandom() {
    return {
        nombre: faker.commerce.productName(),
        price: faker.commerce.price(),
        url: faker.system.filePath()
    }
}

app.get('/api/productos-test', (req, res) => {
    const objs = [];

    for (let i = 0; i < 10; i++){
        objs.push(creaCombinacionesRandom())
    }
    res.json(objs)
})



const PORT = 8070
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server runs on port: ${PORT}`);
})
connectedServer.on('Error', error => console.log(`Error en el servoidor: ${error}`))


