import { uploadLabeledImages, getDescriptorsFromDB } from "../database/db.js";
import ProfileModel from "../Schema/Profile.js";

const signupGet = (req, res) => {
    const context = {
        title: "Signup"
    }
    res.render('signup', context);
}

const signupPost = async (req, res) => {
    const photo = req.files.photo.tempFilePath;
    const { name, email } = req.body;
    const fid = await uploadLabeledImages([photo]);
    await ProfileModel.create({ name, email, fid });
    if (fid) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
}

const signinGet = (req, res) => {
    const context = {
        title: "Signin"
    }
    res.render('signin', context);
}

const signinPost = async (req, res) => {
    try {
        const photo = req.files.photo.tempFilePath;
        const results = await getDescriptorsFromDB(photo);
        const fid = results[0]._label;
        const profile = await ProfileModel.find({ fid });
        res.json({
            success: true,
            name: profile[0].name,
            email: profile[0].email,
            date: profile[0].date,
        });
    } catch (error) {
        res.json({
            success: false
        })
    }
}

export { signupGet, signupPost, signinGet, signinPost }
