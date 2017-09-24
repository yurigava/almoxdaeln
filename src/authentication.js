 // src/authentication.js
module.exports = function(app, passport) {

  app.get('/', isLoggedIn, function(req, res) {
    res.send('almoxarife'); // load the index.ejs file
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    //successRedirect : '/profile', // redirect to the secure profile section
    //failureRedirect : '/login', // redirect back to the signup page if there is an error
  }),
  function(req, res) {
    //Inserir lógica para verificar papel aqui
    res.send({role: 'almoxarife', username: req.user.username});

    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
  });

  // =====================================
  // Access Control ======================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.send('ok');
  });

  app.get('/getRole', isLoggedIn, function (req, res) {
    //Inserir lógica para verificar papel aqui
    res.send({role: 'almoxarife', username: req.user.username})
  });

  app.get('/equips', isLoggedIn, function(req, res) {
    res.send('ok');
  });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
  //Inserir lógica para verificar papel aqui

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.status(401).send({role: 'loggedOut'})
}
