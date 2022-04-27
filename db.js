const mongoose = require('mongoose');

var dbURI = 'mongodb://localhost:27017/MusicStreamer'
// var dbURI = 'mongodb+srv://ankitProj:BARCA@nkit$980@cluster0.v1cqa.mongodb.net/MusicStreamer?retryWrites=true&w=majority'

mongoose.connect(dbURI, {useUnifiedTopology:true, useNewUrlParser: true})
.then(connected=>console.log('db connected'))
.catch(error=>console.log('error conecting to db'))