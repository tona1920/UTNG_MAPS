const router = require('express').Router();
const passport = require('passport');
var User = require('../models/user');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('signin');
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/home',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.post('/new', passport.authenticate('local-new', {
  successRedirect: '/new',
  failureRedirect: '/new',
  failureFlash: true
}));

router.get('/table',isAuthenticated, async (req, res, next) => {
  const users = await User.find().lean();
  console.log(users)
  res.render('table',{users:users});
});

router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});

router.get('/new',isAuthenticated, (req, res, next) => {
  res.render('new');
});

router.get('/home',isAuthenticated, (req, res, next) => {
  res.render('home');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}

router.get('/delete/:id',async (req,res)=>{
  const {id} = req.params;
  await User.findByIdAndDelete(id);
  res.redirect('/home')
});
//router.put('/api/user/:id', controller.update);
//router.delete('/api/user/:id', controller.delete);

module.exports = router;
