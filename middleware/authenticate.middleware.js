const jwt = require("jsonwebtoken");
const config = require("./../index");
const userModel = require("./../user/user.model");

module.exports = function (req, res, next) {
  var token = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.query.token
    ? req.query.token
    : null;

    if(token){
        jwt.verify(token, config.jwtSecret, function(err, decodedJWT){
           
            if(err){
                console.log(err)
                return next(err)
            }
                      userModel.findById(decodedJWT.id)
                .exec(function(err,user){
                    if(err) return next(err)
                    if(!user) return next({msg: 'user not found from system or please sign in again'})

                    req.loggedInUser = user;
                    return next();
                })
        })
    }
    else{
        return next({
            msg: 'Token not there, Please sign in'
        })
    }
};
