const multer = require('multer')


var storage = multer.diskStorage({
    filename: function(req,file, cb){
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`)

    },
    destination: function(req,file, cb){
        cb(null, './faceDetection/images')
    }

})
function fileFilter(req,file,cb){
    var mimeType = file.mimetype.split('/')[0]
    if(mimeType == 'image')
    cb(null, true)

    else{
        req.fileErr = true;
        cb(null, false)
    }
}

var uploadImageFromCamera = multer({
    storage, fileFilter
})
module.exports = uploadImageFromCamera