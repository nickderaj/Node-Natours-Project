const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongooose.Schema({
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
    validate: [
      (val) => val === this.password,
      'Password not repeated properly',
    ],
  },
});

const User = mongoose.model('User', userSchema);
module.eports = User;
