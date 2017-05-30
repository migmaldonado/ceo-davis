var express = require('express');
const User = require('../models/user');
var router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});

//delete
router.post('/decisioners/delete/:id', (req, res, next) => {

  const decisionerId = req.params.id;

  User.remove( {_id: decisionerId}, (err) => {
    if (err) {
      next(err);
      return;
    }

  res.redirect('/decisioners');
  });
});


//edit
router.get('/decisioners/edit/:id', (req, res, next) => {

  const decisionerId = req.params.id;

  User.findById(decisionerId, (err, deco) => {
    if (err) {
      next(err);
      return;
    }

  res.render('admin/edit-decisioner-view.ejs', {decisioner: deco});
  });
});


router.post('/decisioners/edit/:id', (req, res, next) => {

  const decisionerId = req.params.id;

  const editedDeco = {
    name: req.body.newName,
    email: req.body.newEmail,
    isAdmin: req.body.newIsAdmin
  };

  User.findByIdAndUpdate(decisionerId, editedDeco, (err, deco) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/decisioners');
  // res.redirect('admin/decisioners');
  });
});

router.get('/decisioners', (req, res, next) => {
  User.find((err, decisionersList) => {
    if (err) {
      return;
    }

    res.render('admin/decisioners', {
      decisioners: decisionersList
    });
  });
});

router.get('/decisioners/:id', (req, res, next) => {
  const decisionerId = req.params.id;

  User.findById(decisionerId, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    res.render('admin/decisioners', {
      theDecisioner: theUser
    });
  });
});


module.exports = router;
