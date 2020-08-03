module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash(
      'error_msg',
      'You are not logged in, please log in to gain access'
    );
    res.redirect('/login');
  },
};
