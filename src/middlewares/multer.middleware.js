import multer from "multer";



const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
        
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    },
})

export const upload = multer({storage:localStorage}) //can also be send directly