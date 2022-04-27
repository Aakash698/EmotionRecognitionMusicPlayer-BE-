var router = require("express").Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var userModel = require("./user.model");
var config = require("./../index");
var randomString = require("randomstring");
var mailSend = require("./mail.send");

router.route("/register").post(function (req, res, next) {

  var newUser = new userModel({});
  newUser.fullName = req.body.fullName;
  newUser.userName = req.body.userName;
  newUser.email = req.body.email;
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser
    .save()
    .then((data) => {
      var token = jwt.sign(
        {
          id: data._id,
        },
        config.jwtSecret
      );
      var response = {
        token, 
        user:data
      }
        res.status(200).json(response)
      
      })
    .catch((err) => {
      console.log(err)
      next(err)
    });
});

router.route("/login").post(function (req, res, next) {

  userModel
    .findOne({
      $or: [
        {
          email: req.body.userName,
        },
        {
          userName: req.body.userName,
        },
      ],
    })
    .then((user) => {
      console.log(user)
      if (user) {
        var passMatched = bcrypt.compareSync(req.body.password, user.password);
        if (passMatched) {
          var token = jwt.sign(
            {
              id: user._id,
            },
            config.jwtSecret
          );
          var response = {
            token, 
            user
          }
            res.status(200).json(response)
        } else {
          return next({
            msg: "invalid password",
          });
        }
      } else {
        return next({
          msg: "invalid userName or email",
        });
      }
    })
    .catch((err) => next(err));
});

router.route("/checkDuplicate").get(function (req, res, next) {
  userModel
    .find({})
    .then((users) => {
      var sendingUsersFiltered = [];
      users.map((user) =>
        sendingUsersFiltered.push({
          email: user.email,
          userName: user.userName,
        })
      );
      res.status(200).json(sendingUsersFiltered);
    })
    .catch((err) => next(err));
});

router.route("/forgot-password").post(function (req, res, next) {
  userModel
    .findOne({
      email: req.body.email,
    })
    .then((user) => {
      var passwordResetToken = randomString.generate(25);
      var passwordResetExpiry = new Date(Date.now(1000 * 60 * 60 * 24));

      var mailData = {
        name: user.userName,
        email: user.email,
        link: `${req.headers.origin}?reset-password=${passwordResetToken}`,
      };

      var mailContent = mailSend.prepareMail(mailData);
      (user.passwordResetToken = passwordResetToken),
        (user.passwordResetExpiry = passwordResetExpiry),
        user.save(function (err, saved) {
          if (err) return next(err);
          else {
            mailSend.sender.sendMail(mailContent, function (err, sent) {
              if (err) return next(err);
              else res.status(200).json(sent);
            });
          }
        });
    })
    .catch((err) => next({ msg: "user not found" }));
});

router.route("/reset-password/:token").post(function (req, res, next) {
  var passResetToken = req.params.token;

  userModel
    .findOne({
      passwordResetToken: passResetToken,
      passwordResetExpiry: {
        $lte: Date.now(),
      },
    })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next({ msg: "invalid token" });

      user.password = bcrypt.hashSync(req.body.password, 10);
      user.passwordResetToken = null;
      user.passwordResetExpiry = null;
      user.save(function (err, reset) {
        if (err) return next(err);
        else res.status(200).json(reset);
      });
    });
});

module.exports = router;
