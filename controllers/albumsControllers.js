import { todosLosAlbums, albumsById, albumByName, updateAlbumsById, deleteAlbumById, addAlbum } from "../models/albumsModel.js";

export const agarrarTodosLosAlbums = (req, res) => {
    const albums = todosLosAlbums(req);
    res.json(albums);
}

export const agarrarAlbumPorId = async (req, res) => {
    const albumsId = parseInt(req.params.id);
    const albums = await albumsById(albumsId);

    if(albums){
        res.json(albums);
    }else{
        res.status(404).json({error:"Album no encontrado"})
    }
}


//Find albums by name
export const agarrarAlbumPorNombre = async (req, res) => {
    const albumNombre = await albumByName(req.params.titulo);

    if(albumNombre){
        res.json(albumNombre);
    }else {
        return res.status(404).send("No hay album con ese nombre");
    }
}

//update album
export const actualizarAlbum = async (req, res) => {
    const albumId = parseInt(req.params.id);
    const updatedAlbum = await updateAlbumsById(albumId, req.body.title);

    if (!updatedAlbum) {
        return res.status(404).send("El guitarrista no fue encontrado");
    }
    
    res.json(updatedAlbum);
}

//Delete Album
export const eliminarAlbum = async (req, res) => {
    const albumId = parseInt(req.params.id);
    const deletedAlbum = await deleteAlbumById(albumId);

    if (!deletedAlbum) {
        return res.status(404).send("El album no fue encontrado");
    }

   // res.status(204).send(); // Respond with no content status
   res.json(deletedAlbum);
}

//Add Album
export const agregarAlbum = async (req, res) => {
    const { title } = req.body;
    
    // Validate the name
     if(!title){
         return res.status(400).send("El nombre es requerido");
     }
 
     const newAlbum = { title };
 
     try {
         const addedAlbum = await addAlbum(newAlbum);
 
         res.json(addedAlbum);
         
 
 
     } catch(err){
         if (err.message === "El album ya existe") {
             return res.status(400).send(err.message);
         }
         return res.status(500).send("Error adheriendo el album");
     }
 
 
     
 
 
 
 
 }