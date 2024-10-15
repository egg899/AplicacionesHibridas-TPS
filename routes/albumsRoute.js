import express from 'express';
import authenticateToken from '../authMiddleware.js';
import { agarrarTodosLosAlbums, agarrarAlbumPorId, agarrarAlbumPorNombre, actualizarAlbum, eliminarAlbum, agregarAlbum } from '../controllers/albumsControllers.js';

const router = express.Router();


router.get('', agarrarTodosLosAlbums);
router.get('/:id', agarrarAlbumPorId);
router.get('/titulo/:titulo', agarrarAlbumPorNombre);
router.put('/:id', actualizarAlbum);
router.delete('/:id', authenticateToken, eliminarAlbum);
router.post('', authenticateToken, agregarAlbum);
export default router;