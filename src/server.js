import express from 'express'
import {Server as HttpServer} from 'http'
import {Server as Socket} from 'socket.io'

// const Contenedor = require('../contenedores/contenedor.js')
// const ContenedorMensajes = require('../contenedores/contenedorMensajes.js')


const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static('../public'))

import ContenedorDB from '../contenedores/contenedorDB.js'
import config from './config.js'

const productos = new ContenedorDB (config.mysql, 'productos')
const mensajes = new ContenedorDB (config.sqlite3, 'mensajes')

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
            
    socket.on('nuevoMensaje', data => {
        mensajes.save(data)
        .then(() => {
            mensajes.getAll()
            .then((res) => {
                socket.emit('mensajes', res)
            })
        })
    })

    mensajes.getAll()
        .then((res) => {
            socket.emit('mensajes', res)
        })

})



const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server runs on port: ${PORT}`);
})
connectedServer.on('Error', error => console.log(`Error en el servoidor: ${error}`))


