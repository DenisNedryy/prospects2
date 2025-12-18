const express = require("express");
const router = express.Router();
const ctrl_entreprises = require("../controllers/entreprises_ctrl");
const { uploadAvatar } = require("../middlewares/multer-config");
const auth = require("../middlewares/auth"); 
const multer = require("multer");
const upload = multer();

router.get('/', ctrl_entreprises.getAllEntreprisesData);
router.post('/siren', ctrl_entreprises.createSiren);



module.exports = router; 