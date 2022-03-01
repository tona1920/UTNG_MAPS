const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const { body,validationResult } = require('express-validator');
const alert = false;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({'email': email})
  console.log(user)
  if(user) {
    alert = true;
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'),alert);
  } else {
    const pass = req.body.pass;
    if(password==pass){
      const newUser = new User();
      newUser.email = email;
      newUser.admin = 'false';
      newUser.username = req.body.username;
      newUser.password = newUser.encryptPassword(password);
      console.log(newUser)
      await newUser.save();
      done(null, newUser);
    }else{
      return done(null, false, req.flash('signupMessage', 'The password is incorrect.'));
    } 
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({email: email});
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  user.password= user.encryptPassword(password);
  return done(null, user);
}));
//return done(null, false, req.flash('signinMessage', 'No User Found'));