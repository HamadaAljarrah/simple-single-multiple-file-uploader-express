import dotenv from "dotenv"
if(process.env.NODE_ENV !== "producation") dotenv.config();
import express from "express"
import fileUpload from "express-fileupload"
import _ from "lodash"


const app = express()
app.set("views", "src/views")

app.set("view-engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(fileUpload({createParentPath: true}))




app.get("/", (req, res)=>{
    res.render("index.ejs")
})

//upload single file
app.post("/upload-img", async (req, res)=>{
    try {

        if(!req.files){
            return res.json({
                status: false,
                message: "No file was attached"
            });
        }

        let img = req.files.img;
        img.mv("./uploads/" + img.name);
        res.json({
            status: true,
            message: "file successfully uploaded",
            data: {
                name: img.name,
                size: img.size,
            }
        })
    } catch (error) {
        res.json(error.message)
    }

})


//upload multiple files
app.post("/upload-images", async (req, res)=>{
    try {

        if(!req.files){
            return res.json({
                status: false,
                message: "No file was attached"
            });
        }
        let data = [];
        _.forEach(_.keysIn(req.files.images), key =>{
            let image = req.files.images[key];
            image.mv( + "./uploads/" + image.name);
            data.push({
                name: image.name,
                mimetype: image.mimetype,
                size: image.size
            });
        })

        res.json({
            status: true,
            message: "file successfully uploaded",
            data: data
        })
        
    } catch (error) {
        res.json(error.message)
    }

})




const port = process.env.PORT || 3000
app.listen(port, ()=> console.log("listning to port *" + port))