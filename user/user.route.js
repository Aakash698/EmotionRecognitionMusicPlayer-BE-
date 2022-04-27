var router = require("express").Router();
var uploadProfileImage = require("./../middleware/uploadProfileImage");
var userCtrl = require("./user.controller");

router.get("/", userCtrl.getAll);
router.get("/loginWithJWT",function(req,res,next){
  if(req.loggedInUser)
  res.status(200).json(req.loggedInUser)
  else{
    next({
      msg: 'not logged in'
    })
  }
})
router.post(
  "/uploadProfileImage",
  uploadProfileImage.single("img"),
  userCtrl.uploadImage
);

router
  .route("/:id")
  .get(userCtrl.getById)
  .put(userCtrl.update)
  .delete(userCtrl.remove);


module.exports = router;
