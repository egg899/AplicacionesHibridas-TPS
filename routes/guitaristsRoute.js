import express from 'express';
import authenticateToken from '../authMiddleware.js';
// import { agarrarTodosLosGuitarristas, agarrarGuitarristasPorId, agarrarGuitarristasPorNombre, actualizarGuitarrista, eliminarGuitarrista, agregarGuitarrista } from '../controllers/guitaristControllers.js';
import {agarrarTodosLosGuitarristas, agregarGuitarrista, agarrarGuitarristaPorId, agarrarGuitarristaPorNombre, actualizarGuitarrista, eliminarGuitarrista } from '../controller/guitaristController.js';


const router = express.Router();
router.get('', agarrarTodosLosGuitarristas);
router.get('/:id', agarrarGuitarristaPorId);
router.get('/nombre/:nombre', agarrarGuitarristaPorNombre);
router.put('/:id', authenticateToken, actualizarGuitarrista);
router.delete('/:id', authenticateToken, eliminarGuitarrista);
router.post('', authenticateToken, agregarGuitarrista);
// const router = express.Router();

// router.get('', agarrarTodosLosGuitarristas); 
// router.get('/:id', agarrarGuitarristasPorId);
// router.get('/nombre/:nombre', agarrarGuitarristasPorNombre);
// router.put('/:id', authenticateToken, actualizarGuitarrista);
// router.delete('/:id', authenticateToken, eliminarGuitarrista);
// router.post('', authenticateToken, agregarGuitarrista);
export default router;