import express from 'express';
import { agarrarTodosLosUsuarios, agregarUsuarios, loginUsuario } from '../controllers/usuariosControllers.js';

const router = express.Router();

router.get('', agarrarTodosLosUsuarios);
router.post('', agregarUsuarios);
router.post('/login', loginUsuario);
export default router;

