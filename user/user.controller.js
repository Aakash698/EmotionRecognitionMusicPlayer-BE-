const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const user = require("./user.model");
var path = require("path");

function mapUserRequest(user, userDetails) {
  if (userDetails.email) user.email = userDetails.email;
  if (userDetails.fullName) user.fullName = userDetails.fullName;
  if (userDetails.password)
    user.password = bcrypt.hashSync(userDetails.password, 10);
    if(userDetails.song){
      if(userDetails.action === 'remove'){
        user.songs.splice(user.songs.indexOf(userDetails.song), 1);
      }
      else{
        user.songs.push(userDetails.song)
      }
    }

  return user;
}

function uploadImage(req, res, next) {
  if (req.fileErr) {
    return next({ msg: "Invalid File Format" });
  }
  if (req.file) {
    var user = req.loggedInUser;
    if(user.image){
      console.log(  path.join(
        process.cwd(),
        "/profileImages/" + user.image
      ))
      fs.unlink(
        path.join(
          process.cwd(),
          "/profileImages/" + user.image
        ),
        function (err, removed) {
          if (err) console.log("file removing err");
          else console.log("file removed");
        }
      );
    }
    user.image = req.file.filename;
    user.save(function (err, uploaded) {
      if (err) {
        fs.unlink(
          path.join(
            process.cwd(),
            "/profileImages" + req.file.filename
          ),
          function (err, removed) {
            if (err) console.log("file removing err");
            else console.log("file removed");
          }
        );
        return next(err);
      } else {
        res.status(200).json(uploaded);
      }
    });
  }
}
function getAll(req, res, next) {
  return userModel.find({}).exec(function (err, users) {
    if (err) return next(err);
    if (!users) return next({ msg: "no users at all" });

    res.status(200).json(users);
  });
}
function getById(req, res, next) {
  userModel.findOne({ _id: req.params.id }).exec(function (err, found) {
    if (err) return next(err);
    else res.status(200).json(found);
  });
}
function update(req, res, next) {

  return userModel.findById(req.params.id).exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next({ msg: "user not found" });

    var updatedUser = mapUserRequest(user, req.body);
    updatedUser.save(function (err, updated) {
      if (err) return next(err);
      res.status(200).json(updated);
    });
  });
}
function remove(req, res, next) {
  return userModel.findById(req.params.id).exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next({ msg: "user not found" });

    fs.unlink(
      path.join(process.cwd(), "./uploads/profileImages/" + user.image),
      function (err, removed) {
        if (err) {
          return next(err);
        } else
          userModel
            .findByIdAndRemove(req.params.id)
            .then((removed) => res.status(200).json("User Removed"))
            .catch((err) => next(err));
      }
    );
  });
}

module.exports = {
  getById,
  getAll,
  update,
  remove,
  uploadImage,
};
