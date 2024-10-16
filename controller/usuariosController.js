import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import usuariosModel from "../model/usuariosModel.js";


dotenv.config();
// const secretKey = 'SECRETA';
const secretKey = process.env.SECRET_KEY;

//Mostrar todos los usuarios
export const agarrarTodosLosUsuarios = async (req, res) => {
    try {
        const { sort, order = 'asc', page = 1, limit = 10 } = req.query; // default limit to 10

        const queryOptions = {};
        
        // Set the sorting order
        if (sort) {
            queryOptions.sort = { [sort]: order === 'asc' ? 1 : -1 }; // 1 for ascending, -1 for descending
        }

        // Fetch the users with pagination and sorting
        const usuarios = await usuariosModel.find()
            .sort(queryOptions.sort)
            .skip((page - 1) * limit) // Pagination
            .limit(Number(limit)); // Convert limit to number

        // Get the total count of users for pagination info
        const totalCount = await usuariosModel.countDocuments();

        // Send response with data and total count for pagination
        res.json({ totalCount, usuarios });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Adherir Usuarios
const adherirUsuario = async (newUser) => {
    const existingUser = await usuariosModel.findOne({ name: newUser.name });
    if (existingUser) {
        throw new Error("El usuario ya existe");
    }

    const newPassword = await bcrypt.hash(newUser.password, 10);
    const userCount = await usuariosModel.countDocuments(); // Get the current user count
    newUser.id = userCount > 0 ? userCount + 1 : 1;
    const orderedUsuarios = new usuariosModel({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newPassword,
    });

    try {
        const savedUser = await orderedUsuarios.save(); // Save to MongoDB
        return savedUser;
    } catch (err) {
        console.error("Error guardando el usuario en la base de datos", err);
        throw new Error("Error al guardar el usuario en la base de datos");
    }
};



export const agregarUsuarios = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(400).send("El nombre es requerido");
    }
    if (!email) {
        return res.status(400).send("El email es requerido");
    }
    if (!password) {
        return res.status(400).send("El password es requerido");
    }

    const newUser = { name, email, password };

    try {
        const addedUser = await adherirUsuario(newUser);
        res.json(addedUser);
    } catch (err) {
        if (err.message === "El usuario ya existe") {
            return res.status(400).send(err.message);
        }
        return res.status(500).send("Error adheriendo al usuario");
    }
};


//Login user
export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send("El email es requerido");
    }
    if (!password) {
        return res.status(400).send("El password es requerido");
    }

    try {
        // Find user by email in the MongoDB database
        const user = await usuariosModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ mensaje: "No se encontró el usuario" });
        }

        // Compare the provided password with the hashed password in the database
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ mensaje: "El password es incorrecto" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error al iniciar sesión");
    }
};