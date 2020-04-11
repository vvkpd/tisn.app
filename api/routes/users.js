var express = require('express');
var router = express.Router();

const auth = require('./auth');
const permissions = require('./permissions');

const usersController = require('../controllers/usersController');

router.get('/', auth.required, usersController.get);
router.post('/', usersController.post);

router.get('/:id', auth.required, usersController.getId);
router.put('/:id', [auth.required, permissions], usersController.putId);

router.post('/log-in', usersController.logIn);

module.exports = router;
