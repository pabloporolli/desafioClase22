const express = require('express')
const {Server: HttpServer} = require('http')
const {Server: Socket} = require('socket.io')
// const upload = require('./multer.js')

const Contenedor = require('../contenedores/contenedor.js')
const ContenedorMensajes = require('../contenedores/contenedorMensajes.js')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const productos = new Contenedor ('contenedores/productos.json')
const mensajes = new ContenedorMensajes ('contenedores/mensajes.json')

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');
    
    socket.on('nuevoProducto', data => {
        productos.save(data)
    })

    productos.getAll()
        .then((res) => {
            socket.emit('productos', res)
        })

    socket.on('nuevoMensaje', data => {
        mensajes.save(data)
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


