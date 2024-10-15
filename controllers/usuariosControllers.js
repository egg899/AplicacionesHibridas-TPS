import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { todosLosUsuarios, adherirUsuario } from "../models/usuariosModels.js";

dotenv.config();
// const secretKey = 'SECRETA';
const secretKey = process.env.SECRET_KEY;
export const agarrarTodosLosUsuarios = (req, res) => {
    const usuarios = todosLosUsuarios();
    res.json(usuarios);
}


export const agregarUsuarios = async (req, res) => {
        const { name, email, password } = req.body;

        if(!name){
            return res.status(400).send("El nombre es requerido");
        }
        if(!email){
            return res.status(400).send("El email es requerido");
        }
        if(!password){
            return res.status(400).send("El password es requerido");
        }

        const newUser = { name, email, password };

        try {
            const addedUser = await adherirUsuario(newUser);
    
            res.json(addedUser);
            
    
    
        } catch(err){
            if (err.message === "El usuario ya existe") {
                return res.status(400).send(err.message);
            }
            return res.status(500).send("Error aderiendo al usuario");
        }

}


//Login user

export const loginUsuario = async (req, res) => {
    const {email, password } = req.body;
    
    if(!email){
        return res.status(400).send("El email es requerido");
    }
    if(!password){
        return res.status(400).send("El password es requerido");
    }

    const user = await todosLosUsuarios().find(u => u.email === email);
    console.log(user);

    if(!user){
        return res.status(404).send({mensaje:"No se encontró el usuario"});
    }//!user 

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        return res.status(401).json({mensaje: "El password es incorrecto"});
    }

    const token = jwt.sign({ id:user.id, email: user.email }, secretKey, { expiresIn: "1h" });

    res.status(200).json({ token });
}