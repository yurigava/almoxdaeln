// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
handleDisconnect(connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
      done(err, rows[0]);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',
    new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'login',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      // we are checking to see if the user trying to login already exists
      connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false);
        } else {
          // if there is no user with that username
          // create the user
          var newUserMysql = {
            username: username,
            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
          };

          var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

          connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
            newUserMysql.id = rows.insertId;
            return done(null, newUserMysql);
          });
        }
      });
    })
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-login',
    new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'login',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
      connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
        if (err)
          return done(err);
        if (!rows.length) {
          return done(null, false);
        }

        // if the user is found but the password is wrong
        if (!bcrypt.compareSync(password, rows[0].password))
          return done(null, false);

        // all is well, return successful user
        return done(null, rows[0]);
      });
    })
  );
};

function handleDisconnect(client) {
  client.on('error', function (error) {
    if (!error.fatal) return;
    if (error.code !== 'PROTOCOL_CONNECTION_LOST') console.log(error);

    console.error('> Re-connecting lost MySQL connection: ' + error.stack);

    connection = mysql.createConnection(dbconfig.connection);
    handleDisconnect(connection);
    connection.query('USE ' + dbconfig.database);
  });
};
