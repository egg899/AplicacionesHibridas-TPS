import mongoose from "mongoose";

const guitaristsSchema = new mongoose.Schema({
    id:{type:Number, required:true},
    name:{type:String, required:true}
})

export default mongoose.model("guitarists", guitaristsSchema);


