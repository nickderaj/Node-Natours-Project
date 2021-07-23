const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password.'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE & SAVE!! not update
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function is password was actually modified:
  if (!this.isModified('password')) return next(); // guard clause

  // Hash the password with cost of 12:
  this.password = await bcrypt.hash(this.password, 12); // has is an async method that returns a promise

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined; // so this isn't persisted in the DB
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
