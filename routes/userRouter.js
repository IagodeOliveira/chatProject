const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../controller/auth');
const cors = require('cors');

// const options = {
//   origin: '...'
// }

// router.use(cors(options));

// router.use(cors());

router.post('/login', userController.login);

router.post('/register', userController.register);

router.post('/chat', auth, userController.chat);

router.get('*', userController.error);

module.exports = router;