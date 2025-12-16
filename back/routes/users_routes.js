const express = require("express");
const router = express.Router();
const ctrl_auth = require("../controllers/users_ctrl");
const uploadAvatar  = require("../middlewares/multer-config");
const auth = require("../middlewares/auth"); 
const multer = require("multer");
const upload = multer();

router.get("/", ctrl_auth.getUsers);
router.get("/getOneUser/:id", ctrl_auth.getOneUser);
router.get("/myProfil", auth, ctrl_auth.getMyPfofil);
router.get("/isConnected", auth, ctrl_auth.isConnected);
router.post("/inscription", upload.none(), ctrl_auth.inscription);
router.post("/connection", upload.none(), ctrl_auth.connection); 
router.post("/logout", ctrl_auth.disconnect);
router.put("/update", auth, uploadAvatar, ctrl_auth.updateUser);
router.put("/updatePassword", auth, uploadAvatar, ctrl_auth.updatePassword);

module.exports = router; 