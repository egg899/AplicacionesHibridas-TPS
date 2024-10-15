import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let usuarios = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const filePath = path.join(__dirname, "../data/usuarios.json");

//Load initial data from file
fs.readFile(filePath, "utf8", function(err, data) {
    if(err){
        console.error("Error reading the file", err);
    } 
    usuarios = JSON.parse(data);
    //console.log("usuario data loaded:", usuarios);
});


export const todosLosUsuarios =  () => {
    return usuarios;
}

//Add a new user
export const adherirUsuario = async (newUser) => {
    let usuarios = todosLosUsuarios();
    const existingUser = usuarios.find(u => u.name === newUser.name);
    if(existingUser) {
        throw new Error("El usuario ya existe");
    }


    //Generate a unique ID
    newUser.id = usuarios.length > 0 ? usuarios.length + 1 : 1;

    const newPassword = await bcrypt.hash(newUser.password, 10);

    const orderedUsusarios = {
        id: newUser.id,
        name: newUser.name,
        email:newUser.email,
        password: newPassword,
        
    };

    usuarios.push(orderedUsusarios);

    try {
        await fsPromises.writeFile(filePath, JSON.stringify(usuarios, null, 2));
    } catch (err) {
        console.error("Error escribiendo en el archivo", err);
        throw new Error("Error al escribir al archivo");
    }



    return orderedUsusarios;
}

//Login a user
