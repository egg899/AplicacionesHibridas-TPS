import guitaristsModel from "../model/guitaristsModel.js";

//todos los guitarristas
const todosLosGuitarristas = async (req) => {
    const { sort, page = 1, limit = 10 } = req.query; // Set default limit to 10 if not specified

    // Convert limit to a number
    const limitNumber = parseInt(limit);

    // Build the query options
    const queryOptions = {
        limit: limitNumber,
        skip: (page - 1) * limitNumber,
        sort: sort === 'asc' ? { name: 1 } : sort === 'desc' ? { name: -1 } : {} // Sort by name
    };

    // Fetch the guitarists from the database
    const guitarists = await guitaristsModel.find({}, null, queryOptions);

    return guitarists; // Return the paginated and sorted guitarists
};


export const agarrarTodosLosGuitarristas = async (req, res) => {
    try {
        const guitarristas = await todosLosGuitarristas(req); // Await the async function
        res.json(guitarristas); // Return the guitarists as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

//guitarrista por ID
const guitarristasById = async (id) => {
    return await guitaristsModel.findOne({ id });
}

export const agarrarGuitarristaPorId = async (req, res) => {
    const guitarristaId = parseInt(req.params.id);

    try {
        const guitarrista = await guitarristasById(guitarristaId);

        if(guitarrista){
            res.json(guitarrista);
        } else{
            res.status(404).json({ error:"Guitarrista no encontrado"})
        }


    }catch(error){
        res.status(500).json({error:error.message});
    }
}

//Encontrar guitarrista por Nombre

const guitarristasByName = async (name) => {
    // Normalize the name (lowercase, no spaces) for the search
    const normalizedGuitarist = name.toLowerCase().replace(/\s+/g, '');

    // Use a MongoDB regular expression search to find matching guitarists
    const matchingGuitarist = await guitaristsModel.find({
        name: { 
            $regex: new RegExp(normalizedGuitarist, 'i') // Case-insensitive search
        }
    });

    return matchingGuitarist;
};

export const agarrarGuitarristaPorNombre = async (req, res) => {
    try {
        const guitarristasNombre = await guitarristasByName(req.params.nombre);

        if(guitarristasNombre && guitarristasNombre.length > 0){
            res.json(guitarristasNombre);
        } else {
            return res.status(404).send("No hay guitarrista con ese nombre");
        }


    } catch(error){
        return res.status(500).json({error: error.message});
    }
}

//ActualizarGuitarrista
const updatedGuitarristasById = async (id, name) => {
    // Find the guitarist by ID and update their name
    const updatedGuitarist = await guitaristsModel.findOneAndUpdate(
        { id }, // Search condition
        { name }, // Update data
        { new: true } // Return the updated document
    );

    return updatedGuitarist; // Return the updated guitarist
};

export const actualizarGuitarrista = async (req, res) => {
    const guitarristaId = parseInt(req.params.id);
    try{
        const updatedGuitarrista = await updatedGuitarristasById(guitarristaId, req.body.name);
        if (!updatedGuitarrista) {
            return res.status(404).send("El guitarrista no fue encontrado"); // Return 404 if not found
        }
        res.json(updatedGuitarrista);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
};

//Borrar guitarrista
const deleteGuitarristasById = async (id) => {
    const deletedGuitarist = await guitaristsModel.findOneAndDelete({ id });
    return deletedGuitarist;
}

export const eliminarGuitarrista = async (req, res) => {
    const guitarristaId = parseInt(req.params.id);

    try{
        const deletedGuitarrista = await deleteGuitarristasById(guitarristaId);
        if(!deletedGuitarrista) { 
            return res.status(404).send("El guitarrista no fue encontrado");
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

//Agregar Guitarrista
export const agregarGuitarrista = async (req, res) => {
    const { name } = req.body;

    if(!name) {
        return res.status(400).send("El nombre es requerido.");
    }

    try {
        const existingGuitarist = await guitaristsModel.findOne({ name });
        if(existingGuitarist){
            return res.status(400).send("El guitarrista ya existe");
        }

        const guitaristCount = await guitaristsModel.countDocuments();
        const newGuitarist = new guitaristsModel({
            id: guitaristCount > 0 ? guitaristCount + 1 : 1,
            name
        });
        const savedGuitarist = await newGuitarist.save();
        res.json(savedGuitarist);


    } catch(error){
        res.status(500).json({ error: error.message });
    }


}


