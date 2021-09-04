const express = require('express');
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

const router = new express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

// ###########################
// ## Iteration 1 - Sign Up ##
// ###########################

// ### Sign-up GET route ###
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

// ### Sign-up POST route ###
router.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((document) => {
      user = document;
      if (user) {
        throw new Error('USERNAME_ALREADY_REGISTERED');
      } else {
        return bcryptjs.hash(password, 10);
      }
    })
    .then((passwordHashAndSalt) => {
      return User.create({
        username,
        passwordHashAndSalt
      });
    })
    .then(entry => {
      console.log('New user created', entry);
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

// ##########################
// ## Iteration 2 - Log In ##
// ##########################

// ### Log-in GET route ###
router.get('/log-in', (req, res, next) => {
  res.render('log-in');
});

// ### Log-in POST route ###
router.post('/log-in', (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((document) => {
      user = document;
      if (!user) {
        throw new Error('ACCOUNT_NOT_FOUND');
      } else {
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((comparisonResult) => {
      if (comparisonResult) {
        console.log('User was authenticated');
        req.session.userId = user._id;
        res.redirect('/');
      } else {
        throw new Error('WRONG_PASSWORD');
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
