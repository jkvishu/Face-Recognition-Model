import { env, nets } from "face-api.js";
import { Canvas, Image } from "canvas";

const applyMonkeyPatch = () => {
    env.monkeyPatch({ Canvas, Image });
}

const loadFaceModels = async () => {
    const dir = process.cwd() + "/face/models";

    await nets.faceRecognitionNet.loadFromDisk(dir);
    await nets.faceLandmark68Net.loadFromDisk(dir);
    await nets.ssdMobilenetv1.loadFromDisk(dir);
}

export { applyMonkeyPatch, loadFaceModels }
