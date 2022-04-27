// require("@tensorflow/tfjs-node");
// const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const canvas = require("canvas");
const fs = require("fs");
const cv = require('opencv4nodejs')
const sys = require('sys');



async function faceDet(req, res, next) {
    let fileName
    if (req.file) {
        fileName = req.file.filename
    } else if (req.body.uri) {
        try {
            var img = req.body.uri
            var data = img.replace(/^data:image\/\w+;base64,/, "");
            var buf = Buffer.from(data, 'base64');
            fs.writeFileSync(path.join(__dirname, 'images/a.png'), buf);

            fileName = `a.png`
        } catch (e) {
            console.log(e)
        }
    } else {
        return next({
            msg: 'No images'
        })
    }
    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    try {
        const canvImg = await canvas.loadImage(
            path.join(__dirname, `images/${fileName}`)
        );
        const image = await cv.imread(path.join(__dirname, `/images/${fileName}`));
        const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
        const { objects, numDetections } = classifier.detectMultiScale(image.bgrToGray());
        if (!objects.length) {
            fs.unlink(
                path.join(process.cwd(), "./faceDetection/images/" + fileName),
                function(err, removed) {
                    if (err) console.log("file removing err");
                    else console.log("file removed");
                }
            );
            return next({
                msg: 'No face detected'
            })
        } else {
            res.status(200).json(objects[0])
            // const model = await tf.loadLayersModel(
            //     "http://localhost:8000/models/model.json"
            // );
            // const obj = objects[0]
            // const cnvs = canvas.createCanvas(48, 48);
            // const ctx = cnvs.getContext("2d");
            // ctx.drawImage(canvImg, obj.x, obj.y, obj.width, obj.height, 0, 0, cnvs.width, cnvs.height);
            // const tensor = tf.browser.fromPixels(cnvs, 1)
            //     .div(255)
            //     .toFloat()
            //     .expandDims(0)


            // const prediction = await model.predict(tensor).data();
            // var emotions = [
            //     "Angry",
            //     "Disgust",
            //     "Fear",
            //     "Happy",
            //     "Sad",
            //     "Surprise",
            //     "Neutral"
            // ];
            // var index = Object.values(prediction).findIndex(
            //     (p) => p === Math.max(...Object.values(prediction))
            // );

            // res.status(200).json(emotions[index])
            fs.unlink(
                path.join(process.cwd(), "./faceDetection/images/" + fileName),
                function(err, removed) {
                    if (err) console.log("file removing err");
                    else console.log("file removed");
                }
            );
        }

    } catch (e) {
        console.log('err', e)
        return next(e)
    }
}


module.exports = {

    faceDet,
};