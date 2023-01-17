const socket = io.connect()

const agregarProducto = document.getElementById('formAgregarProducto')
agregarProducto.addEventListener('submit', e => {
    e.preventDefault()

    const name = document.getElementById('nombre').value
    const price = document.getElementById('precio').value
    const url = document.getElementById('foto').value

    const nuevoProducto = {
        name: name,
        price: price,
        url: url
    }

    socket.emit('nuevoProducto', nuevoProducto);

})

function render(data) {
    const tablaProductos = data.map(item => {
        return (`
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.url}</td>
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


//--------- DESNORMALIZAR MENSAJES----------------------
const author = new normalizr.schema.Entity('authors', {}, {idAttribute:"email"})
const mensaje = new normalizr.schema.Entity('text',{
    author: author
})
const schemaMensajes = new normalizr.schema.Entity('posts',{
    mensajes: [mensaje]
})

//---------------------------------------


const email = document.getElementById('inputUsername')
const message = document.getElementById('inputMensaje')
const botonEnviar = document.getElementById('btnEnviar')

const agregarMensaje = document.getElementById('formPublicarMensaje')
agregarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const email = document.getElementById('inputUsername').value
    const message = document.getElementById('inputMensaje').value
    const firstName = document.getElementById('firstname').value
    const lastName = document.getElementById('lastname').value
    const age = document.getElementById('age').value
    const alias = document.getElementById('alias').value
    const avatar = document.getElementById('avatar').value

    const nuevoMensaje = {
        author: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            age: age,
            alias: alias,
            avatar: avatar
        },
        text: message
    }

    socket.emit('nuevoMensaje', nuevoMensaje)
    
    // message.focus()

    agregarMensaje.reset()

})

function renderMensajes(data) {
    const listaMensajes = data.mensajes.map(item => {
        return (`
            <div>
                <ul class="list-group">
                    <li class="list-group-item" id="lista">
                    <strong style="color: blue">${item.author.email}</strong> <span style="color: brown">[${(new Date()).toLocaleString()}]:
                    </span> <em style="color: green">${item.text}</em>
                    <img width="50" src="${item.avatar}" alt=" ">     
                    </li>
                </ul>
            </div>
            `)
        }).join('')
        document.getElementById('mensajes').innerHTML = listaMensajes

    }

    
    
    socket.on('mensajes', async data => {
        let dataSize = JSON.stringify(data).length
        console.log("DATA: ", data);
        console.log("DATASIZE: ", dataSize);

        let mensajesD = await normalizr.denormalize(data.result, schemaMensajes, data.entities)
        console.log("D: ", mensajesD);
        let mensajesDsize = JSON.stringify(mensajesD).length
        console.log("MENSAJESD SIZE: ", mensajesDsize);

        let porcentajeC = parseInt((dataSize * 100) / mensajesDsize)
        console.log(`Porcentaje de compresión ${porcentajeC}%`)
        document.getElementById('compresion-info').innerText = porcentajeC

        renderMensajes(mensajesD)
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


