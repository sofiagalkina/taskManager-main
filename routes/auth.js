const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongodb = require('../db/connect');

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const db = mongodb.getDb().db();
  const user = await db.collection('user').findOne({ _id: id });
  done(null, user);
});

// Local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const db = mongodb.getDb().db();
    const user = await db.collection('user').findOne({ username });

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(err);
      if (res) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  })
);

module.exports = passport;
