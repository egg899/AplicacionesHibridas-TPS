import { todosLosGuitarristas, guitarristasById, guitarristasByName, updateGuitarristasById, deleteGuitarristasById, addGuitarrista } from "../models/guitaristsModels.js";

export const agarrarTodosLosGuitarristas = (req, res) => {
    const guitarristas = todosLosGuitarristas(req);
    res.json(guitarristas);
}

export const agarrarGuitarristasPorId = async (req, res) => {
    const guitarristaId = parseInt(req.params.id);
    const guitarrista = await guitarristasById(guitarristaId);

    if(guitarrista){
        res.json(guitarrista);
    }else{
        res.status(404).json({error:"Guitarrista no encontrado"})
    }
}

export const agarrarGuitarristasPorNombre = async (req, res) => {
   const guitarristasNombre = await guitarristasByName(req.params.nombre);

    if(guitarristasNombre){
        res.json(guitarristasNombre);
    }else {
        return res.status(404).send("No hay guitarrista con ese nombre");
    }


  
}

export const actualizarGuitarrista = async (req, res) => {
    const guitarristaId = parseInt(req.params.id);
    const updatedGuitarrista = await updateGuitarristasById(guitarristaId, req.body.name);

    if (!updatedGuitarrista) {
        return res.status(404).send("El guitarrista no fue encontrado");
    }
    
    res.json(updatedGuitarrista);
}


export const eliminarGuitarrista = async (req, res) => {
    const guitarristaId = parseInt(req.params.id);
    const deletedGuitarrista = await deleteGuitarristasById(guitarristaId);

    if (!deletedGuitarrista) {
        return res.status(404).send("El guitarrista no fue encontrado");
    }

   // res.status(204).send(); // Respond with no content status
   res.json(deletedGuitarrista);
}

export const agregarGuitarrista = async (req, res) => {
   const { name } = req.body;
   
   // Validate the name
    if(!name){
        return res.status(400).send("El nombre es requerido");
    }

    const newGuitarist = { name };

    try {
        const addedGuitarist = await addGuitarrista(newGuitarist);

        res.json(addedGuitarist);
        


    } catch(err){
        if (err.message === "El guitarrista ya existe") {
            return res.status(400).send(err.message);
        }
        return res.status(500).send("Error adheriendo al guitarrista");
    }


    




}