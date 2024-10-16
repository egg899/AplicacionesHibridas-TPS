import mongoose, { Schema } from "mongoose";

const albumsSchema = new mongoose.Schema({
    id:{type:Number, required:true},
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'guitarists',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
   
    imageUrl: {
        type: String,
        required: true
    }
})

export default mongoose.model("albums", albumsSchema);