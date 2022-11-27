const fs = require ('fs').promises

class Contenedor {
    constructor (path) {
        this.fileName = path;
    }

    async save (producto) {
        try {
            let dataSinJSON = await fs.readFile(this.fileName, 'utf-8');
            const data = JSON.parse(dataSinJSON);
            let idUltimo;
            data.length === 0 ? idUltimo = 0 : idUltimo = (data[data.length-1].id);
            const idNuevo = idUltimo + 1;
            producto.id = idNuevo;
            data.push(producto);

            await fs.writeFile(this.fileName, JSON.stringify(data, null, 2), 'utf-8');
            
            let nuevaRawData = await fs.readFile(this.fileName, 'utf-8');
            const nuevaData = JSON.parse(nuevaRawData);
            console.log("Producto guardado con éxito. Éste es el nuevo listado: ", nuevaData);
            console.log("El id del nuevo producto es: ", idNuevo);
            return idNuevo;
        }
        catch (err) {
            console.log("Error al escribir: " + err);
        }
    }
    
    async getAll () {
        try {
            const rawData = await fs.readFile(this.fileName, 'utf-8');
            const data = JSON.parse(rawData);
            console.log(data);
            return data;
        }
        catch (err) {
            console.log("Error al leer el archivo: " + err);
        }

    }

    async deleteAll () {
        try {
            await fs.writeFile(this.fileName, JSON.stringify([], null, 2), 'utf-8');
            console.log("El archivo fue borrado íntegramente.");
            return;
        }
        catch (err) {
            console.log("Error al borrar todo el archivo: " + err);
        }
    }

    async deleteById (num) {
        try {
            let dataSinJSON = await fs.readFile(this.fileName, 'utf-8');
            const data = JSON.parse(dataSinJSON);
            const prodAConservar = data.filter(prod => prod.id !== num);
            await fs.writeFile(this.fileName, JSON.stringify(prodAConservar, null, 2),'utf-8');
            console.log("El producto fue eliminado correctamente.");
            return;
        }
        catch (err) {
            console.log("Error al traer por ID: " + err);
        }
    }

    async getById (num) {
        try {
            let dataSinJSON = await fs.readFile(this.fileName, 'utf-8');
            const data = JSON.parse(dataSinJSON);
            const prodFiltrado = data.filter(prod => prod.id === num);
            if (prodFiltrado.length > 0) {
                console.log("El producto consultado es el siguiente: ", prodFiltrado)
                return prodFiltrado;
            }
            else {
                console.log("El producto no se encuentra: ", null);
                return null;
            }
        }
        catch (err) {
            console.log("Error al traer por ID: " + err);
        }
    }

    async modifyById (id, nuevaInfo) {
        try {
            let dataSinJSON = await fs.readFile(this.fileName, 'utf-8');
            const data = JSON.parse(dataSinJSON);
            let prodFiltrado = data.filter(prod => prod.id === id);
            const indice = data.findIndex(element => element.id === id);
            data[indice] = {
                id: id,
                title: nuevaInfo.title || data[indice].title,
                price: nuevaInfo.price || data[indice].price,
                thumbnail: nuevaInfo.thumbnail || data[indice].thumbnail
            }
            await fs.writeFile(this.fileName, JSON.stringify(data, null, 2),'utf-8');
        }
        catch (err) {
            console.log("Error al modificar un producto: " + err);
        }
    }

}

const productos = new Contenedor ('./productos.json');


module.exports = Contenedor;

// Métodos a probar
// productos.save(scott);
// productos.getById(8);
// productos.getAll();
// productos.deleteById(8);
// productos.deleteAll();


