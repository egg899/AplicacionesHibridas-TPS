import albumsModel from "../model/albumsModel.js";


// Todos los albums
export const agarrarTodosLosAlbums = async (req, res) => {
    try {
        const { sort, order = 'asc', page = 1, limit = 10 } = req.query; // default limit to 10

        const queryOptions = {};
        
        // Set the sorting order
        if (sort) {
            queryOptions.sort = { [sort]: order === 'asc' ? 1 : -1 }; // 1 for ascending, -1 for descending
        }

        // Fetch the albums with pagination and sorting
        const albums = await albumsModel.find()
            .populate('artist')
            .sort(queryOptions.sort)
            .skip((page - 1) * limit) // Pagination
            .limit(Number(limit)); // Convert limit to number

        res.json(albums);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




//Agarrar album por ID
const albumById = async (id) => {
    return await albumsModel.findOne({ id });
}

export const agarrarAlbumPorId = async (req, res) => {
    const albumId = parseInt(req.params.id);

    try {
        const album = await albumById(albumId);

        if(album){
            res.json(album);
        } else{
            res.status(404).json({ error:"Album no encontrado"})
        }


    }catch(error){
        res.status(500).json({error:error.message});
    }
}

//Agarra Album por nombre
const albumByName = async (name) => {
    // Normalize the name (lowercase, no spaces) for the search
    const normalizedAlbum = name.toLowerCase().replace(/\s+/g, '');

    // Use a MongoDB regular expression search to find matching guitarists
    const matchingAlbum = await albumsModel.find({
        title: { 
            $regex: new RegExp(normalizedAlbum, 'i') // Case-insensitive search
        }
    });

    return matchingAlbum;
};

export const agarrarAlbumPorNombre = async (req, res) => {
    try {
        const albumNombre = await albumByName(req.params.titulo);

        if(albumNombre && albumNombre.length > 0){
            res.json(albumNombre);
        } else {
            return res.status(404).send("No hay Album con ese nombre");
        }


    } catch(error){
        return res.status(500).json({error: error.message});
    }
}



//ActualizarAlbum por Id
const updatedAlbumById = async (id, title, year, imageUrl) => {
    // Find the guitarist by ID and update their name
    const updatedAlbum = await albumsModel.findOneAndUpdate(
        { id }, // Search condition
        { title }, // Update data
        { year },
        { imageUrl },
        { new: true } // Return the updated document
    );

    return updatedAlbum; // Return the updated guitarist
};

export const actualizarAlbum = async (req, res) => {
    const albumId = parseInt(req.params.id);
    try{
        const updatedAlbum = await updatedAlbumById(albumId, req.body.title, req.body.year, req.body.imageUrl);
        if (!updatedAlbum) {
            return res.status(404).send("El Album no fue encontrado"); // Return 404 if not found
        }
        res.json(updatedAlbum);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
};

//Borrar Album
const deleteAlbumById = async (id) => {
    const deletedAlbum = await albumsModel.findOneAndDelete({ id });
    return deletedAlbum;
}

export const eliminarAlbum = async (req, res) => {
    const albumId = parseInt(req.params.id);

    try{
        const deletedAlbum = await deleteAlbumById(albumId);
        if(!deletedAlbum) { 
            return res.status(404).send("El album no fue encontrado");
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

//Agregar Album

export const agregarAlbum = async (req, res) => {
    const { title, artist, year, imageUrl } = req.body;

    if(!title) {
        return res.status(400).send("El nombre es requerido.");
    }

    try {
        const existingAlbum = await albumsModel.findOne({ title });
        if(existingAlbum){
            return res.status(400).send("El album ya existe");
        }

        const albumCount = await albumsModel.countDocuments();
        const newAlbum = new albumsModel({
            id: albumCount > 0 ? albumCount + 1 : 1,
            title,
            artist,
            year,
            imageUrl,
        });
        const savedAlbum = await newAlbum.save();
        res.json(savedAlbum);


    } catch(error){
        res.status(500).json({ error: error.message });
    }


}