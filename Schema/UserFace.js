import { Schema, model } from "mongoose";

const faceSchema = new Schema({
    descriptions: {
        type: Array,
        required: true,
    }
});

const FaceModel = model("FaceModel", faceSchema);

export default FaceModel;
