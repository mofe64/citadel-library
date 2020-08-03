const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.register = catchAsync(async (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  let errors = [];
  if (
    !firstname ||
    !lastname ||
    !username ||
    !email ||
    !password ||
    !passwordConfirm
  ) {
    errors.push({ msg: 'All fields must be entered' });
  }

  if (password !== passwordConfirm) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  console.log(errors);
  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstname,
      lastname,
      email,
      username,
    });
  } else {
    if (await User.findOne({ email: email })) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('register', {
        errors,
        firstname,
        lastname,
        email,
        username,
      });
    }
    if (await User.findOne({ username: username })) {
      errors.push({ msg: 'username is taken' });
      return res.render('register', {
        errors,
        firstname,
        lastname,
        email,
        username,
      });
    }
    newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
    });
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            req.flash('success_msg', 'You are now registred and can log in');
            res.redirect('/login');
          })
          .catch((err) => console.log(err));
      })
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

exports.logout = catchAsync(async (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    //console.log(req.user);
    return next();
  }
  return next();
});

exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'You are not logged in, please log in to gain access');
  res.redirect('/login');
};

exports.restrictTo = (...roles) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  next();
};
