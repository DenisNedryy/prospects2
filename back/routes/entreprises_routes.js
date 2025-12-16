const express = require("express");
const router = express.Router();
const ctrl_entreprises = require("../controllers/entreprises_ctrl");
const { uploadAvatar } = require("../middlewares/multer-config");
const auth = require("../middlewares/auth"); 
const multer = require("multer");
const upload = multer();

router.get('/', ctrl_entreprises.getAllEntreprisesData);

router.get('/sirenDepLength', ctrl_entreprises.getSirenDepLength);
router.get('/siren/:dep', ctrl_entreprises.getSirenPerDep);

router.get('/dep/:dep', ctrl_entreprises.getEntreprisesByDep);
router.get('/query/:query', ctrl_entreprises.getEntreprisesByQuery)

router.post('/siren', ctrl_entreprises.createSiren);
router.post('/name', auth, ctrl_entreprises.createName);
router.post('/email', auth, ctrl_entreprises.createEmail); 


module.exports = router; 