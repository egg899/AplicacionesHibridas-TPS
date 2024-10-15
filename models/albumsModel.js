import express from 'express';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {dirname, join} from 'path';


let albums = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/albums.json");

//Load initial data from file
fs.readFile(filePath, "utf8", (err, data) => {
    if(err) {
        console.error("Error reading the file", err);
    } 
    albums = JSON.parse(data);
    //console.log("Albums data loaded:", albums);
});

export const todosLosAlbums = (req) => {
    //return albums;
    //console.log(albums.length)
    const { sort, page = 1, limit = albums.length } = req.query;

    if(sort){
        albums.sort((a,b) => a.title.localeCompare(b.title) * (sort === 'asc'? 1 : -1));
    }

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAlbums = albums.slice(startIndex, endIndex);

    return paginatedAlbums;
}

//Find all the albums by ID
export const albumsById = (id) => {
    return albums.find((a) => a.id === id);

}

//Find all the albums by Name

export const albumByName = (name) => {
    const normalizedAlbum = name.toLowerCase().replace(/\s+/g, '');

    const matchingAlbum = albums.find(album => {
        const normalizedName = album.title.toLowerCase().replace(/\s+/g, '');
        return normalizedName.includes(normalizedAlbum);
    });
    return matchingAlbum;
}

//update the album
export const updateAlbumsById = async (id, title) => {
    const album = albums.find((a) => a.id === id);
    
    if (!album) {
        return null; // Return null if the guitarist is not found
    }

    album.title = title;

    try {
        await fsPromises.writeFile(filePath, JSON.stringify(albums, null, 2));
    } catch (err) {
        console.error("Error writing to the file", err);
        return null;
    }

    return album;

}


//Delete Album
export const deleteAlbumById = async(id) => {
    const index = albums.findIndex((a) => a.id === id);
    
    if (index === -1) {
        return null; // Return null if the guitarist is not found
    }

    const deletedAlbum = albums.splice(index, 1)[0];

    try{
        await fsPromises.writeFile(filePath, JSON.stringify(albums, null, 2));
    } catch(err){
        console.error("Error writing to the file", err);
        return null;
    }

    return deletedAlbum; // return

}

//Add a new album
export const addAlbum = async (newAlbum) => {
    //let guitarists = await todosLosGuitarristas();//Load existing Guitarists

    //check if the guitarist exist
    const existingAlbum = albums.find(a => a.title === newAlbum.title);
    if(existingAlbum) {
        throw new Error("El album ya existe");
    }

    //Generate a unique ID
    newAlbum.id = albums.length > 0 ? albums.length + 1 : 1;

    const orderedAlbum = {
        id: newAlbum.id,
        title: newAlbum.title,
    };
    //Add the new album to the album array
    albums.push(orderedAlbum);

    try {
        await fsPromises.writeFile(filePath, JSON.stringify(albums, null, 2));
    } catch (err) {
        console.error("Error writing to the file", err);
        throw new Error("Error al escribir al archivo");
    }

    return orderedAlbum;



 
}