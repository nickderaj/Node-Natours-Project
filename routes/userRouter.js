const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect); // protecting all the routes beyond this point

router.patch('/updatePassword/', authController.updatePassword);
router.get('/me/', userController.getMe, userController.getUser);
router.patch(
  '/updateMe/',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
); // photo is the field in the form that's going to be uploading the image
router.delete('/deleteMe/', userController.deleteMe);

router.use(authController.restrictTo('admin')); // only admins beyond this point

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
