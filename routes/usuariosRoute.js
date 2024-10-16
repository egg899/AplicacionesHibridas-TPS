import express from 'express';
import { agarrarTodosLosUsuarios, agregarUsuarios, loginUsuario } from '../controller/usuariosController.js';

const router = express.Router();

router.get('', agarrarTodosLosUsuarios);
router.post('', agregarUsuarios);
router.post('/login', loginUsuario);
export default router;

