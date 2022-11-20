import express from "express";
import fileUpload from "express-fileupload";
import { connectDatabase } from "./database/db.js";
import { applyMonkeyPatch, loadFaceModels } from "./face/faceRecog.js";
import authRoute from "./routes/auth.js"
import path from "path";

const app = express();

// connecting to database
connectDatabase();
// applying monkey patch
applyMonkeyPatch()
// loading face recognition modules
loadFaceModels();

// template engine
app.set("view engine", "ejs");

// serving static files
app.use(express.static(path.join(process.cwd(), 'public')))

// middlewares
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// route
app.use('/', authRoute);

app.listen(3000, () => {
  console.log("server is Listening http://localhost:3000");
});
