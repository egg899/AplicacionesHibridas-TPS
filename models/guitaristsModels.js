import express from 'express';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {dirname, join} from 'path';

let guitarists = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const filePath = path.join(__dirname, "../data/guitarists.json");
//console.log("filePathhhh",filePath);
//Load initial data from file
fs.readFile(filePath, "utf8", function(err, data) {
    if(err){
        console.error("Error reading the file", err);
    } 
    guitarists = JSON.parse(data);
    //console.log("Guitarists data loaded:", guitarists);
});

export const todosLosGuitarristas = (req) => {
   // return guitarists;
   //console.log(guitarists.length)
   const { sort, page = 1, limit = guitarists.length } = req.query;

   

    //sorted guitarists
    if(sort){
        guitarists.sort((a,b) => a.name.localeCompare(b.name) * (sort === 'asc' ? 1 : -1));
    }

    //pagination
    const startIndex = (page - 1 ) * limit;
    const endIndex = startIndex + limit;
    const paginatedGuitarrist = guitarists.slice(startIndex, endIndex);

    return paginatedGuitarrist;



}

//Find all the guitarists By Id
export const guitarristasById = (id) => {
    return guitarists.find((guitarist) => guitarist.id === id);
}

//Find all the guitarists By Name
export const guitarristasByName = (name) => {
    const normalizedGuitarist = name.toLowerCase().replace(/\s+/g, '');

    const matchingGuitarist = guitarists.find(guitarist => {
        const normalizedName = guitarist.name.toLowerCase().replace(/\s+/g, '');
        return normalizedName.includes(normalizedGuitarist);
    });
     return matchingGuitarist;
}

//Update exiting guitarist

export const updateGuitarristasById = async (id, name) => {
    const guitarist = guitarists.find((guitarist) => guitarist.id === id);
    
    if (!guitarist) {
        return null; // Return null if the guitarist is not found
    }

    guitarist.name = name;

    try {
        await fsPromises.writeFile(filePath, JSON.stringify(guitarists, null, 2));
    } catch (err) {
        console.error("Error writing to the file", err);
        return null;
    }

    return guitarist;

}

//Delete guitarrist
export const deleteGuitarristasById = async(id) => {
    const index = guitarists.findIndex((guitarist) => guitarist.id === id);
    
    if (index === -1) {
        return null; // Return null if the guitarist is not found
    }

    const deletedGuitarist = guitarists.splice(index, 1)[0];

    try{
        await fsPromises.writeFile(filePath, JSON.stringify(guitarists, null, 2));
    } catch(err){
        console.error("Error writing to the file", err);
        return null;
    }

    return deletedGuitarist; // return

}

//Add a new guitarist
export const addGuitarrista = async (newGuitarist) => {
    //let guitarists = await todosLosGuitarristas();//Load existing Guitarists

    //check if the guitarist exist
    const existingGuitarist = guitarists.find(g => g.name === newGuitarist.name);
    if(existingGuitarist) {
        throw new Error("El guitarrista ya existe");
    }

    //Generate a unique ID
    newGuitarist.id = guitarists.length > 0 ? guitarists.length + 1 : 1;

    const orderedGuitarist = {
        id: newGuitarist.id,
        name: newGuitarist.name,
    };
    //Add the new guitarist to the guitarist array
    guitarists.push(orderedGuitarist);

    try {
        await fsPromises.writeFile(filePath, JSON.stringify(guitarists, null, 2));
    } catch (err) {
        console.error("Error writing to the file", err);
        throw new Error("Error al escribir al archivo");
    }

    return orderedGuitarist;



 
}