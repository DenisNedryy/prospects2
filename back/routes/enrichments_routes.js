const express = require("express");
const router = express.Router();
const pappersCtrl = require("../controllers/enrichments/pappers_ctrl");
const dropcontactCtrl = require("../controllers/enrichments/dropcontact_ctrl");
const { uploadAvatar } = require("../middlewares/multer-config");
const auth = require("../middlewares/auth"); 
const multer = require("multer");
const upload = multer();

router.post('/pappers/run', pappersCtrl.runBatch);
router.post("/dropcontact/run", dropcontactCtrl.runBatch);

module.exports = router; 