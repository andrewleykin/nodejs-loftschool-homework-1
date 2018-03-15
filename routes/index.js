var express = require('express');
var router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/');
};

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

/* GET home page. */
router.get('/', ctrlHome.getIndex);

/* POST home page. */
router.post('/', ctrlHome.sendForm);

/* GET login page. */
router.get('/login', ctrlLogin.getLogin);

/* POST login page. */
router.post('/login', ctrlLogin.sendLogin);

/* GET admin page. */
router.get('/admin', isAdmin, ctrlAdmin.getAdmin);

/* POST admin/skills page. */
router.post('/admin/skills', isAdmin, ctrlAdmin.sendSkills);

/* POST admin/upload page. */
router.post('/admin/upload', isAdmin, ctrlAdmin.sendUpload);

module.exports = router;
