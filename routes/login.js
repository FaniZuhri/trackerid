var express = require('express');
var router = express.Router();
var Tracker = require('../model/trackerid.js')
var session = require('express-session')
var chalk = require('chalk')


/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('pages/auth/login', {
      // title: 'Login - TrackerID',
      layout: null
    });
  
})

router.post('/', (req, res, next) => {
  var username = req.body.username
  var password = req.body.pass

  // console.log(chalk.green(username, password))


  Tracker.findOne({
    username: username,
    pass: password
  }, (err, masuk) => {
    if (masuk != null) {
      // console.log(chalk.blue(masuk._id))
      req.session.login = true
      req.session.name = masuk.username
      req.session.id = masuk._id
      req.session.id2= masuk.id
      req.session.email = masuk.email
      req.session.tipe = masuk.tipe
      req.flash('success','Success To Login')
      console.log(chalk.blueBright(req.session.id, req.session.name, req.session.email, req.session.id2, req.session.tipe))
      // req.flash('success', 'Login Success')
      res.redirect('/dashboard/' + masuk.id)
    } else {
      Tracker.findOne({
        email: username,
        pass: password
      }, (err, masuk) => {
        if (masuk != null) {
          // console.log(chalk.blue(masuk._id))
          req.session.login = true
          req.session.name = masuk.username
          req.session.id = masuk._id
          req.session.id2= masuk.id
          req.session.email = masuk.email
          req.session.tipe = masuk.tipe
          req.flash('success','Success To Login')
          console.log(chalk.blueBright(req.session.id, req.session.name, req.session.email, req.session.id2, req.session.tipe))
          // req.flash('success', 'Login Success')
          res.redirect('/dashboard/' + masuk.id)
        }
        else{
          console.log(chalk.red(err))
          req.flash('error', 'Failed To Login')
          res.redirect('/login')
        } 
      })

    }
  })

});

// /* GET users listing. */
// router.get('/logout', function (req, res, next) {
//   req.session.destroy(function (error) {
//     console.log(error)
//     res.redirect('./', {
//       layout: null
//     })
//   })
// });

module.exports = router;