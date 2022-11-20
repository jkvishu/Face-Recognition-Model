import mongoose from "mongoose";
import FaceModel from "../Schema/UserFace.js";
import { detectSingleFace, LabeledFaceDescriptors, FaceMatcher, createCanvasFromMedia, matchDimensions, detectAllFaces, resizeResults } from "face-api.js";
import { loadImage } from "canvas";

const DATABASE_SERVER = '127.0.0.1:27017'
const DATABASE_NAME = "faceDB";

// creating connection with database
const connectDatabase = async () => {
    console.log("Connecting to Database. Please Wait...")
    try {
        await mongoose.connect(`mongodb://${DATABASE_SERVER}/${DATABASE_NAME}`);
        console.log('Connected to Database Successfully.');
    } catch (error) {
        console.log(error);
        console.log('Problem while connecting to Database!');
    }
}

const uploadLabeledImages = async (images) => {
    try {
        const descriptions = [];
        for (let i = 0; i < images.length; i++) {
            const img = await loadImage(images[i]);
            const detections = await detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detections.descriptor);
        }

        const fid = mongoose.Types.ObjectId();
        await FaceModel.create({
            _id: fid,
            descriptions: descriptions,
        });
        return fid;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getDescriptorsFromDB = async (image) => {
    let faces = await FaceModel.find();
    for (let i = 0; i < faces.length; i++) {
        for (let j = 0; j < faces[i].descriptions.length; j++) {
            faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
        }
        faces[i] = new LabeledFaceDescriptors(faces[i]._id.toString(), faces[i].descriptions);
    }

    const faceMatcher = new FaceMatcher(faces, 0.6);
    const img = await loadImage(image);
    let temp = createCanvasFromMedia(img);
    const displaySize = { width: img.width, height: img.height };
    matchDimensions(temp, displaySize);

    const detections = await detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = resizeResults(detections, displaySize);
    const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
    return results;
}

export { connectDatabase, uploadLabeledImages, getDescriptorsFromDB };
