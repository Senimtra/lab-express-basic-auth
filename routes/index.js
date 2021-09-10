// ### Require express ###
const express = require('express');

// ### Require user model ###
const User = require('./../models/user');

// ### Require bcryptjs module ###
const bcryptjs = require('bcryptjs');

// ### Instantiate index router ###
const router = new express.Router();

// ### Require route guard middleware ###
const routeGuardMiddleware = require('./../middleware/route-guard');

// ### Root GET route ###
router.get('/', (req, res) => {
  res.render('index');
});

// ###########################
// ## Iteration 1 - Sign Up ##
// ###########################

// ### Sign-up GET route ###
router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

// ### Sign-up POST route ###
router.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) throw new Error('ALL_FIELDS_HAVE_TO_BE_FILLED');
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
router.get('/log-in', (req, res) => {
  res.render('log-in');
});

// ### Log-in POST route ###
router.post('/log-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) throw new Error('ALL_FIELDS_HAVE_TO_BE_FILLED');
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

// ###################################
// ## Iteration 3: Protected Routes ##
// ###################################

router.get('/main', routeGuardMiddleware, (req, res) => {
  res.render('main');
});

router.get('/private', routeGuardMiddleware, (req, res, next) => {
  const userId = req.session.userId;
  User
    .findById(userId)
    .then(foundUser => {
      const userName = foundUser.username;
      res.render('private', { userName });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

// #####################################
// ## Iteration 5 Bonus: Profile Page ##
// #####################################

router.get('/profile', routeGuardMiddleware, (req, res, next) => {
  const userId = req.session.userId;
  User
    .findById(userId)
    .then(foundUser => {
      res.render('profile', { foundUser });
    })
    .catch(error => {
      next(error);
    });
});
