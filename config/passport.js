// config/passport.js

// load all the things we need
var LdapStrategy = require('ldapjs').Strategy;

const ldapOptions = {
  url: "ldap://192.168.33.100:389",
  connectTimeout: "30000",
  reconnect: true
};

const ldapClient = LdapStrategy.createClient(ldapOptions);

module.exports = function(passport) {

  ldapClient.bind('cn=' + userId + ',' + ldapConfig.dn, password, function(err, res) {     
    
    if (err)
      res.send(err);

    ldapClient.unbind()
    res.send('ok');
  });
};