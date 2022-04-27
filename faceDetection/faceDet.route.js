var router = require("express").Router();
var faceDetController = require("./faceDet.controller");
const uploadImageFromCamera = require("../middleware/uploadPhotoFromCamera");

router.post(
    "/",
    uploadImageFromCamera.single("img"),
    faceDetController.faceDet
);




module.exports = router;