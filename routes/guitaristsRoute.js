import express from 'express';
import authenticateToken from '../authMiddleware.js';
import { agarrarTodosLosGuitarristas, agarrarGuitarristasPorId, agarrarGuitarristasPorNombre, actualizarGuitarrista, eliminarGuitarrista, agregarGuitarrista } from '../controllers/guitaristControllers.js';


const router = express.Router();

router.get('', agarrarTodosLosGuitarristas); 
router.get('/:id', agarrarGuitarristasPorId);
router.get('/nombre/:nombre', agarrarGuitarristasPorNombre);
router.put('/:id', authenticateToken, actualizarGuitarrista);
router.delete('/:id', authenticateToken, eliminarGuitarrista);
router.post('', authenticateToken, agregarGuitarrista);
export default router;