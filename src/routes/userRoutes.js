const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../configs/multer'); // Import multer configuration

// Route to add a new user
router.post('/add', upload.single('foto'), userController.addUser);

// Route to update a user
router.put('/update/:id', upload.single('foto'), userController.updateUser);

// Route to list all users
router.get('/list', userController.listUsers);

// Route to find a user by name, ID, or email
router.get('/search', userController.findUser);

// Route to filter users by active or inactive status
router.get('/filter', userController.filterUsers);

// Route to list users by centroId
router.get('/filterByCentro/:centroId', userController.filterUsersByCentro);

module.exports = router;
