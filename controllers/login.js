module.exports.getLogin = function (req, res) {
  res.render('pages/login', {title: 'Main'});
};

module.exports.sendLogin = function (req, res) {
  if (req.body.email === 'admin@mail.ru' && req.body.password === 1234) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('pages/login', {msgslogin: 'Аллло'});
  }
};
