const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const passport = require('passport');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username' },
      (username, password, done) => {
        //match user
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: 'No user with that username',
              });
            }

            //match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else
                done(null, false, {
                  message: 'Incorrect username or password',
                });
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
