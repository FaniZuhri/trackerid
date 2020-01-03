var express = require('express');
var router = express.Router();
var Devname = require('../model/devname')
var Tracker = require('../model/trackerid')
var moment = require('moment')

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.login==true) {
    // console.log('lala'+req.session.id2)
    res.redirect('/dashboard/'+req.session.id2)
    
  }
  else{
    // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    Devname.count({},(err,count)=>{
      // console.log(count)
      Devname.find({},(err,data)=>{
        // console.log(data)
        Tracker.count({},(err,user)=>{
          // console.log(user)
          res.render('./pages/landing2', {
            layout: null,
            data:data,
            count:count,
            user:user,
          });
        })
      })
    })
  }



})

module.exports = router;