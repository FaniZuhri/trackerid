var express = require('express');
var router = express.Router();
var axios = require('axios');
var chalk = require('chalk');
var Devname = require('../model/devname')
var Tracker = require('../model/trackerid')

/* GET users listing. */
router.get('/:id', (req, res, next) => {
  if (req.session.login==true){
    nofresh=true
    admin=true
    id = req.params.id
      Tracker.find({tipe:'user'}).exec((err, users) => {
        //   console.log(users)
        setTimeout(()=>{
            res.render('./pages/userpage', {
              users: users,
              idd: req.session.id2,
              user: req.session.name,
              admin:admin,
              nofresh:nofresh,
            })
          },0)
          
        })

  }
  else{
    res.redirect('/')
  }

  // console.log(id)

      // Tracker.findOne({
      //   _id: id
      // }, 'username', (err, y) => {

      

      // })
    })



module.exports = router;