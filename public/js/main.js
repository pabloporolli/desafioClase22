const socket = io.connect()

const agregarProducto = document.getElementById('formAgregarProducto')
agregarProducto.addEventListener('submit', e => {
    e.preventDefault()

    const nombre = document.getElementById('nombre').value
    const precio = document.getElementById('precio').value
    const foto = document.getElementById('foto').value

    const nuevoProducto = {
        nombre: nombre,
        precio: precio,
        foto: foto
    }

    socket.emit('nuevoProducto', nuevoProducto)

})

function render(data) {
    const tablaProductos = data.map(item => {
        return (`
            <tr>
                <td>${item.id}</td>
                <td>${item.nombre}</td>
                <td>${item.precio}</td>
                <td>${item.foto}</td>
            </tr>
        `)
    }).join('')
    document.getElementById('listaProductos').innerHTML = tablaProductos
}

socket.on('productos', data => {
   render(data)
})


//-----------------------------------------------------------------------------------------------------------
// CHAT

const email = document.getElementById('inputUsername')
const message = document.getElementById('inputMensaje')
const botonEnviar = document.getElementById('btnEnviar')

const agregarMensaje = document.getElementById('formPublicarMensaje')
agregarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const email = document.getElementById('inputUsername').value
    const message = document.getElementById('inputMensaje').value

    const nuevoMensaje = {
        email: email,
        text: message
    }

    socket.emit('nuevoMensaje', nuevoMensaje)
    
    // message.focus()

    agregarMensaje.reset()

})

function renderMensajes(data) {
    const listaMensajes = data.map(item => {
        return (`
            <div>
                <ul class="list-group">
                    <li class="list-group-item" id="lista">
                    <strong style="color: blue">${item.email}</strong> <span style="color: brown">[${(new Date()).toLocaleString()}]: </span> <em style="color: green">${item.text}</em>
                    </li>
                </ul>
            </div>
            `)
        }).join('')
        document.getElementById('mensajes').innerHTML = listaMensajes

    }
    
    
    socket.on('mensajes', data => {
        renderMensajes(data)
})

email.addEventListener('input', () => {
    const hayEmail = email.value.length
    const hayTexto = message.value.length
    message.disabled = !hayEmail
    botonEnviar.disabled = !hayEmail || !hayTexto
})

message.addEventListener('input', () => {
    const hayTexto = message.value.length
    botonEnviar.disabled = !hayTexto
})


