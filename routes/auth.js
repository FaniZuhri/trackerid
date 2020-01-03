var express = require('express');
var router = express.Router();
var Tracker = require('../model/trackerid.js')
var session = require('express-session')
var chalk = require('chalk')

/* GET users listing. */
router.get('/', function (req, res, next) {
  req.session.login = false
  req.session.destroy()  
  req.session = null
  // req.session.id = null
  // req.session.id2 = null
  // req.session.name = null
  // req.session.email = null
  console.log(req.session)
  // req.session = null
    res.redirect('/')
  })
// });

module.exports = router;