const fs = require ('fs').promises

class ContenedorMensajes {
    constructor (path) {
        this.fileName = path;
    }

    async save (mensaje) {
        try {
            let dataSinJSON = await fs.readFile(this.fileName, 'utf-8');
            const data = JSON.parse(dataSinJSON);
            data.push(mensaje);

            await fs.writeFile(this.fileName, JSON.stringify(data, null, 2), 'utf-8');
            
            let nuevaRawData = await fs.readFile(this.fileName, 'utf-8');
            const nuevaData = JSON.parse(nuevaRawData);
            console.log("El mensaje ha sido guardado correctamente: ", nuevaData);
            return nuevaData;
        }
        catch (err) {
            console.log("Error al escribir: " + err);
        }
    }
    
    async getAll () {
        try {
            const rawData = await fs.readFile(this.fileName, 'utf-8');
            const data = JSON.parse(rawData);
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

}

module.exports = ContenedorMensajes;


