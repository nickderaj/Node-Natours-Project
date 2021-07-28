const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Factory Methods:
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); // do NOT update password with this as the encryption middleware will not run!!
exports.deleteUser = factory.deleteOne(User);

// Specific Methods:
const filterObj = (obj, ...alloweddFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (alloweddFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.password)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword instead.',
        400
      )
    );

  // 2) Filter the body so they can't alter all details like making themself admin
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user doc
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Unused route:
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please use signup instead',
  });
};
