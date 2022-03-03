const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const { body,validationResult } = require('express-validator');

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
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const pass = req.body.pass;
    if(password==pass){
      const newUser = new User();
      newUser.email = email;
      newUser.admin = 'false';
      newUser.username = req.body.username;
      newUser.password = newUser.encryptPassword(password);
      console.log(newUser)
      if(newUser.username.length >0){
        await newUser.save();
        done(null, newUser);
      }else{
        return done(null, false, req.flash('signupMessage', 'The username is incorrect.'));
      }
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
  return done(null, user);
}));


passport.use('local-new', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({'email': email})
  console.log(user)
  if(user) {
    return done(null, false, req.flash('signinMessage', 'The Email is already Taken.'));
  } else {
    const pass = req.body.pass;
    if(password==pass){
      const newUser = new User();
      newUser.email = email;
      newUser.admin = req.body.role;
      newUser.username = req.body.username;
      newUser.password = newUser.encryptPassword(password);
      console.log(newUser)
      if(newUser.username.length >0){
        await newUser.save();
        done(null, false, req.flash('createMessage', 'The user is create.'));
      }else{
        return done(null, false, req.flash('signinMessage', 'The username is incorrect.'));
      }
    }else{
      return done(null, false, req.flash('signinMessage', 'The password is incorrect.'));
    } 
  }
}));
//return done(null, false, req.flash('signinMessage', 'No User Found'));
