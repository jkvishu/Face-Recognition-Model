import { Schema, model } from "mongoose";

const profileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fid: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ProfileModel = model("ProfileModel", profileSchema);

export default ProfileModel;