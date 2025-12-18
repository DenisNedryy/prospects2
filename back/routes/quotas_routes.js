const express = require("express");
const router = express.Router();
const ctrl_quotas = require("../controllers/quotas_ctrl");
const { uploadAvatar } = require("../middlewares/multer-config");
const auth = require("../middlewares/auth"); 
const multer = require("multer");
const upload = multer();

router.get('/pappers', ctrl_quotas.getPappersQuota);
router.get('/dropContact', ctrl_quotas.getDropContactQuota);

module.exports = router; 