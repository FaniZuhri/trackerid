var express = require('express');
var router = express.Router();
var Tracker = require('../model/trackerid.js')
var chalk = require('chalk')

/* GET users listing. */

router.get('/',  (req, res, next)=> {
  res.render('pages/auth/register', {
    // title: 'Register - TrackerID',
    layout: null
  });
});
router.post('/',  (req, res, next)=> {
  var username = req.body.username
  var password = req.body.pass
  var email = req.body.email
  var cpassword = req.body.cpass
  console.log(username, password, email)
  var tracker = new Tracker()
  tracker.username = username
  tracker.pass = password
  tracker.email = email
  tracker.tipe = 'user'
  if (password==cpassword){
    tracker.save((err, y) => {
      if (!err) {
        console.log(chalk.green (y))
        return res.redirect('./login')
      } else {
        console.log(chalk.red('error'))
        Tracker.findOne({username:req.body.username}, (err,ada)=>{
          // console.log(ada.username)
          if (ada){
            req.flash('error', 'Username '+ada.username+' has been used')
            return res.redirect('/register')
          }
          else{
            req.flash('error', 'Username and Email has been used')
            return res.redirect('/register')
          }
        })
      }
    })
  }
  else{
    req.flash('error', 'Password does not matched')
    return res.redirect('/register')   
  }

});

module.exports = router;