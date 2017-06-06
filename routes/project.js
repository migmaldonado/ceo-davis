var express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
var router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});

//redirect to the form
router.get('/upload', (req, res, next) => {
  res.render('users/files', {
    errorMessage: ''
  });
});
//get the info from the form
router.post('/upload', (req, res, next) => {
  const filenameInput = req.body.filename;
  const timestampInput = req.body.timestamp;

    const projectSubmission = {
      filename: filenameInput,
      timestamp: timestampInput
    };

  const theProjecto = new Project(projectSubmission);

  theProjecto.save((err) => {
    if (err) {
      res.render('users/files', {
        errorMessage: 'Something went wrong. Try again later.'
      });
        return;
      }

    res.redirect('/projects');
  });
});



//delete
router.post('/projects/delete/:id', (req, res, next) => {

  const projectId = req.params.id;

  Project.remove( {_id: projectId}, (err) => {
    if (err) {
      next(err);
      return;
    }

  res.redirect('/projects');
  });
});

// visualize
router.get('/projects/visualize', (req, res, next) => {

    // if (err) {
    //   next(err);
    //   return;
    // }

  res.render('users/visualize.ejs');
});


//edit
router.get('/projects/edit/:id', (req, res, next) => {

  const projectId = req.params.id;

  Project.findById(projectId, (err, proj) => {
    if (err) {
      next(err);
      return;
    }

  res.render('users/edit-project-view.ejs', {project: proj});
  });
});


router.post('/projects/edit/:id', (req, res, next) => {

  const projectId = req.params.id;

  const editedProj = {
    filename: req.body.newFileName,
    timestamp: req.body.newTimestamp
  };

  Project.findByIdAndUpdate(projectId, editedProj, (err, proj) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/projects');
  });
});

router.get('/projects', (req, res, next) => {
  Project.find((err, projectsList) => {
    if (err) {
      return;
    }

    res.render('users/projects', {
      projects: projectsList
    });
  });
});

router.get('/projects/:id', (req, res, next) => {
  const projectId = req.params.id;

  Project.findById(projectId, (err, theProjo) => {
    if (err) {
      next(err);
      return;
    }

    res.render('users/projects', {
      theProject: theProjo
    });
  });
});


module.exports = router;

















// router.post('/upload', (req, res, next) => {
//   const filenameInput = req.body.filename;
//   const timestampInput = req.body.timestamp;
//
//     const projectSubmission = {
//       filename: filenameInput,
//       timestamp: timestampInput
//     };
//
//   const theProjecto = new Project(projectSubmission);
//
//   theProjecto.save((err) => {
//     if (err) {
//       res.render('users/files', {
//         errorMessage: 'Something went wrong. Try again later.'
//       });
//         return;
//       }
//
//     res.redirect('/');
//   });
// });
